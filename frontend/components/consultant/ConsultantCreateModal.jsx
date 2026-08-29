import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { consultantService } from '@/services/consultantService';
import useAuthStore from '@/store/authStore';

// Zod validation schema
const formSchema = z.object({
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters long.' }),
  experience_years: z.coerce.number().min(0, { message: 'Experience must be a positive number.' }),
  consultation_fee: z.coerce.number().min(0, { message: 'Fee must be a positive number.' }),
  location: z.string().min(2, { message: 'Location is required.' }),
  languages: z.string().min(2, { message: 'Languages are required (e.g. English, Bangla).' }),
  specializations: z.array(z.number()).min(1, { message: 'Select at least one specialization.' }),
  profile_image: z.any().optional(),
});

export function ConsultantCreateModal({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [specializationsList, setSpecializationsList] = useState([]);

  // Load the specialization list when the dialog opens.
  useEffect(() => {
    if (open) {
      consultantService.getSpecializations()
        .then((res) => setSpecializationsList(res.data || res))
        .catch(() => toast.error('Failed to load specializations.'));
    }
  }, [open]);

  // Initialize the form state.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: '',
      experience_years: 0,
      consultation_fee: 0,
      location: '',
      languages: '',
      specializations: [],
      profile_image: null,
    },
  });

  // Submit handler that builds FormData because the form includes an image file.
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('bio', values.bio);
      formData.append('experience_years', values.experience_years);
      formData.append('consultation_fee', values.consultation_fee);
      formData.append('location', values.location);
      formData.append('languages', values.languages);
      
      // Append array values for DRF handling.
      values.specializations.forEach((id) => {
        formData.append('specializations', id);
      });

      if (values.profile_image) {
        formData.append('profile_image', values.profile_image);
      }

      const response = await consultantService.meCreate(formData);

      toast.success(response.data?.message || 'Profile created successfully!');
      setOpen(false);
      form.reset();

      // Refresh the stored user so the new consultant role applies immediately
      // to the dashboard navigation without needing a re-login.
      useAuthStore.getState().fetchMe();

      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      console.error(error);
      const serverError = error.response?.data?.detail || error.response?.data?.bio?.[0];
      toast.error(serverError || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle specialization selection.
  const handleSpecializationToggle = (id, currentValues) => {
    if (currentValues.includes(id)) {
      form.setValue('specializations', currentValues.filter((item) => item !== id));
    } else {
      form.setValue('specializations', [...currentValues, id]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Become a Consultant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Consultant Profile</DialogTitle>
          <DialogDescription>
            Fill in your professional details to join as a therapist. Your current
            account is upgraded to a consultant role — no second account is created.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            
            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about your expertise..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Experience Years */}
              <FormField
                control={form.control}
                name="experience_years"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience (Years)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Consultation Fee */}
              <FormField
                control={form.control}
                name="consultation_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultation Fee ($/৳)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Languages */}
              <FormField
                control={form.control}
                name="languages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Languages</FormLabel>
                    <FormControl>
                      <Input placeholder="English, Bangla" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Specializations (Badges Checkbox) */}
            <FormField
              control={form.control}
              name="specializations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specializations</FormLabel>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
                    {specializationsList.map((spec) => {
                      const isSelected = field.value.includes(spec.id);
                      return (
                        <button
                          key={spec.id}
                          type="button"
                          onClick={() => handleSpecializationToggle(spec.id, field.value)}
                          className={`px-3 py-1 text-xs rounded-full border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-secondary text-secondary-foreground hover:bg-muted'
                          }`}
                        >
                          {spec.name}
                        </button>
                      );
                    })}
                    {specializationsList.length === 0 && (
                      <span className="text-xs text-muted-foreground">Loading specializations...</span>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Profile Image */}
            <FormField
              control={form.control}
              name="profile_image"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files?.[0])}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}