'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, Loader2, ClipboardList } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { assessmentService } from '@/services/assessmentService';

const CATEGORY_COLORS = {
  stress:     'bg-orange-100 text-orange-700 border-orange-200',
  anxiety:    'bg-yellow-100 text-yellow-700 border-yellow-200',
  depression: 'bg-blue-100 text-blue-700 border-blue-200',
  burnout:    'bg-red-100 text-red-700 border-red-200',
};

const CATEGORY_BG = {
  stress:     'from-orange-50 to-amber-50',
  anxiety:    'from-yellow-50 to-lime-50',
  depression: 'from-blue-50 to-indigo-50',
  burnout:    'from-red-50 to-pink-50',
};

export default function AssessmentListPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assessmentService.getAll()
      .then(res => setQuizzes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-7 h-7 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Mental Health Assessments
            </h1>
            <p className="text-slate-400 max-w-md mx-auto">
              Take a confidential self-assessment to better understand your mental health. Results are for informational purposes only.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {quizzes.map((quiz, i) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/assessment/${quiz.slug}`}>
                  <Card className={`
                    border border-slate-100 shadow-sm hover:shadow-md
                    transition-all duration-200 rounded-2xl overflow-hidden
                    cursor-pointer group h-full
                  `}>
                    <div className={`h-2 bg-gradient-to-r ${CATEGORY_BG[quiz.category]}`} />
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-4xl">{quiz.icon}</span>
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${CATEGORY_COLORS[quiz.category]}`}
                        >
                          {quiz.category}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-slate-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                        {quiz.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <ClipboardList className="w-3.5 h-3.5" />
                            {quiz.question_count} questions
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            ~{quiz.duration_minutes} min
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-10 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-sm text-blue-700 text-center">
          ⚠️ These assessments are for informational purposes only and do not constitute a medical diagnosis. Please consult a qualified professional for proper evaluation.
        </div>
      </div>
    </div>
  );
}