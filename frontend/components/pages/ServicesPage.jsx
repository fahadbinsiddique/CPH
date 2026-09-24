'use client'
// Client implementation of the Services page. Rendered by the server wrapper at app/services/page.jsx.

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  Heart,
  Brain,
  Users,
  User,
  Sparkles,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  Star,
  Quote,
  ChevronRight,
  MessageCircle,
  BookOpen,
  HeartHandshake,
  Smile,
  Moon,
  Sun,
  Award,
  Target,
  Feather,
  Leaf,
  Flower,
  Compass,
  BarChart,
  Activity,
  Zap,
  XOctagon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

const services = [
  {
    id: 1,
    title: 'Individual Therapy',
    icon: User,
    description:
      'Personalized one-on-one sessions tailored to your unique needs, helping you navigate life\'s challenges with professional support.',
    longDescription:
      'Our individual therapy sessions provide a safe, confidential space where you can explore your thoughts, feelings, and behaviors. Using evidence-based approaches like CBT, DBT, and mindfulness, we work together to help you achieve your mental health goals.',
    benefits: [
      'Personalized treatment plans',
      'Confidential and safe environment',
      'Flexible scheduling options',
      'Evidence-based therapeutic approaches',
    ],
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    gradient: 'from-blue-50/50 to-indigo-50/30',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop',
    slug: 'individual-therapy',
  },
  {
    id: 2,
    title: 'Couples Counseling',
    icon: HeartHandshake,
    description:
      'Strengthen your relationship with professional guidance. Improve communication, resolve conflicts, and build deeper connections.',
    longDescription:
      'Our couples counseling helps partners navigate relationship challenges, improve communication, and rebuild trust. Whether you\'re facing conflict, considering separation, or simply want to strengthen your bond, we provide a supportive environment for growth.',
    benefits: [
      'Improved communication skills',
      'Conflict resolution strategies',
      'Rebuilding trust and intimacy',
      'Strengthened emotional connection',
    ],
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    gradient: 'from-rose-50/50 to-pink-50/30',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=400&fit=crop',
    slug: 'couples-counseling',
  },
  {
    id: 3,
    title: 'Child & Adolescent Therapy',
    icon: Smile,
    description:
      'Specialized support for children and teens dealing with emotional, behavioral, or developmental challenges.',
    longDescription:
      'Our child and adolescent therapy services are designed to meet the unique needs of young people. Using play therapy, art therapy, and talk therapy, we help children and teens develop coping skills, build resilience, and thrive.',
    benefits: [
      'Age-appropriate therapeutic approaches',
      'Play and art therapy techniques',
      'Parent guidance and support',
      'School collaboration when needed',
    ],
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    gradient: 'from-amber-50/50 to-orange-50/30',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
    slug: 'child-adolescent-therapy',
  },
  {
    id: 4,
    title: 'Anxiety & Stress Management',
    icon: Moon,
    description:
      'Learn effective techniques to manage anxiety, reduce stress, and find calm in your daily life.',
    longDescription:
      'Our anxiety and stress management program combines evidence-based techniques to help you regain control. From cognitive restructuring to mindfulness practices, we equip you with tools that work.',
    benefits: [
      'Cognitive Behavioral Therapy (CBT)',
      'Mindfulness and relaxation techniques',
      'Stress reduction strategies',
      'Long-term coping skills',
    ],
    color: 'from-teal-500 to-emerald-600',
    bgColor: 'bg-teal-50',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    gradient: 'from-teal-50/50 to-emerald-50/30',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop',
    slug: 'anxiety-stress-management',
  },
  {
    id: 5,
    title: 'Depression Treatment',
    icon: Leaf,
    description:
      'Comprehensive support for individuals experiencing depression, helping you find hope and healing.',
    longDescription:
      'Our depression treatment program provides compassionate, evidence-based care. We work with you to understand the root causes of your depression and develop strategies for recovery and lasting well-being.',
    benefits: [
      'Evidence-based therapeutic approaches',
      'Behavioral activation techniques',
      'Cognitive restructuring',
      'Relapse prevention strategies',
    ],
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-50',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    gradient: 'from-indigo-50/50 to-purple-50/30',
    image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600&h=400&fit=crop',
    slug: 'depression-treatment',
  },
  {
    id: 6,
    title: 'Trauma & PTSD Therapy',
    icon: Compass,
    description:
      'Specialized trauma-informed care to help you process difficult experiences and reclaim your life.',
    longDescription:
      'Our trauma and PTSD therapy uses proven approaches like EMDR, CPT, and trauma-focused CBT. We provide a safe, supportive environment where you can process your experiences at your own pace.',
    benefits: [
      'EMDR therapy',
      'Trauma-focused CBT',
      'Cognitive Processing Therapy',
      'Grounding and stabilization techniques',
    ],
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    gradient: 'from-purple-50/50 to-violet-50/30',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop',
    slug: 'trauma-ptsd-therapy',
  },
  {
    id: 7,
    title: 'Parenting Support',
    icon: Heart,
    description:
      'Guidance and support for parents navigating the challenges of raising children at any age.',
    longDescription:
      'Our parenting support services help you build stronger relationships with your children, manage behavioral challenges, and create a nurturing home environment. We offer individual sessions and family therapy.',
    benefits: [
      'Positive discipline strategies',
      'Communication skills',
      'Building secure attachments',
      'Co-parenting guidance',
    ],
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    gradient: 'from-emerald-50/50 to-teal-50/30',
    image: 'https://images.unsplash.com/photo-1513267048331-5611cad62fd0?w=600&h=400&fit=crop',
    slug: 'parenting-support',
  },
  {
    id: 8,
    title: 'Group Therapy',
    icon: Users,
    description:
      'Connect with others in a supportive group setting, sharing experiences and learning together.',
    longDescription:
      'Our group therapy sessions provide a supportive community where you can share experiences, learn from others, and practice new skills. Groups are led by experienced therapists and cover various topics.',
    benefits: [
      'Peer support and connection',
      'Shared learning experiences',
      'Social skills practice',
      'Reduced isolation',
    ],
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-50',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
    gradient: 'from-cyan-50/50 to-blue-50/30',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&h=400&fit=crop',
    slug: 'group-therapy',
  },
]

// Statistics displayed in the services overview.
const stats = [
  { icon: Users, value: '500+', label: 'Happy Clients' },
  { icon: Star, value: '4.9', label: 'Average Rating' },
  { icon: Clock, value: '8+', label: 'Years Experience' },
  { icon: Award, value: '100%', label: 'Confidential Care' },
]

// Testimonials displayed on the services page.
const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Individual Therapy Client',
    quote:
      'The therapists at CPH have been life-changing. I finally feel understood and supported in my journey toward healing.',
    rating: 5,
  },
  {
    name: 'John & Emily R.',
    role: 'Couples Counseling Clients',
    quote:
      'Couples counseling helped us rebuild our relationship. We communicate better and feel more connected than ever.',
    rating: 5,
  },
  {
    name: 'Lisa K.',
    role: 'Parenting Support Client',
    quote:
      "The parenting support I received gave me the tools I needed to connect with my teenage daughter. I'm so grateful.",
    rating: 5,
  },
]

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedService])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 pt-28 pb-16 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-800 text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              Our Services
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Comprehensive{' '}
              <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
                Mental Health Care
              </span>
            </h1>
            <p className="text-xl text-teal-100/90 max-w-2xl mx-auto font-light">
              We offer a wide range of evidence-based therapeutic services tailored to meet your
              unique needs and goals.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto mt-12">
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                  >
                    <Icon className="w-6 h-6 text-teal-300 mx-auto mb-1" />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-teal-200/80">{stat.label}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {services.map((service) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
                onClick={() => setSelectedService(service)}
              >
                <Card className="h-full border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-teal-500/20 transition-all duration-500 overflow-hidden rounded-2xl">
                  <div className={`h-1 bg-gradient-to-r ${service.color}`} />
                  <CardContent className="p-6">
                    <div
                      className={`w-14 h-14 rounded-2xl ${service.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`w-7 h-7 ${service.iconColor}`} />
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{service.description}</p>

                    <div className="mt-4 flex items-center text-teal-600 font-medium text-sm group-hover:gap-2 transition-all">
                      Learn More <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white/60 backdrop-blur-sm py-16 border-t border-b border-slate-200/60">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <Badge className="mb-3 bg-teal-50 text-teal-700 border-teal-200">Why Choose Us</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Excellence in Mental Health Care</h2>
            <p className="text-slate-500 mt-2">Experience compassionate, professional care from trusted experts.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Confidential Care', desc: 'Your privacy is our top priority' },
              { icon: Award, title: 'Licensed Experts', desc: 'Qualified professionals you can trust' },
              { icon: Calendar, title: 'Flexible Scheduling', desc: 'Book appointments that fit your life' },
              { icon: Heart, title: 'Compassionate Approach', desc: 'Caring support every step of the way' },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx }}
                  className="text-center p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-200/60 hover:shadow-lg hover:border-teal-200 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="font-bold text-slate-800">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <Badge className="mb-3 bg-amber-50 text-amber-700 border-amber-200">Testimonials</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">What Our Clients Say</h2>
          <p className="text-slate-500 mt-2">Real stories from real people who found help at CPH.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all"
            >
              <Quote className="w-8 h-8 text-teal-300 mb-3" />
              <p className="text-slate-600 text-sm leading-relaxed italic">{testimonial.quote}</p>
              <div className="mt-4 flex items-center gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-2 font-semibold text-slate-800">{testimonial.name}</p>
              <p className="text-xs text-slate-400">{testimonial.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-900 to-emerald-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Begin Your Journey?</h2>
            <p className="text-xl text-teal-100/90 max-w-2xl mx-auto mb-8">
              Take the first step toward better mental health. Our compassionate team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/consultant">
                <Button className="bg-white text-teal-800 hover:bg-teal-50 rounded-xl px-8 py-6 text-lg font-semibold shadow-lg shadow-teal-900/20">
                  Find a Consultant
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white/30 text-teal-800 hover:bg-white/10 rounded-xl px-8 py-6 text-lg font-semibold">
                  <Phone className="mr-2 w-5 h-5" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {/* Header Image */}
                <div className="relative h-56 rounded-t-3xl overflow-hidden">
                  <Image
                    src={selectedService.image}
                    alt={selectedService.title}
                    width={800}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <button
                    onClick={() => setSelectedService(null)}
                    className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
                  >
                    <XOctagon className="w-6 h-6 text-red-500" />
                  </button>
                  <div className="absolute bottom-4 left-6">
                    <Badge className="bg-white/20 text-white border-white/20 backdrop-blur-sm">
                      {selectedService.title}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">{selectedService.title}</h2>
                  <p className="text-slate-600 leading-relaxed">{selectedService.longDescription}</p>

                  <div className="mt-6">
                    <h3 className="font-semibold text-slate-800 mb-3">Key Benefits</h3>
                    <ul className="space-y-2">
                      {selectedService.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                    <Link href="/consultant" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-teal-600/20">
                        Book a Session
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/contact" className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl border-slate-200">
                        <Mail className="mr-2 w-4 h-4" />
                        Contact Us
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}