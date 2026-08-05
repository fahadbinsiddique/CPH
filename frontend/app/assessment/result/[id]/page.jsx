'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Calendar, ArrowRight,
  RotateCcw, Loader2, TrendingUp
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { assessmentService } from '@/services/assessmentService';

const SEVERITY_CONFIG = {
  minimal:  { color: 'text-green-600',  bg: 'bg-green-100',  bar: 'bg-green-500',  border: 'border-green-200' },
  mild:     { color: 'text-yellow-600', bg: 'bg-yellow-100', bar: 'bg-yellow-500', border: 'border-yellow-200' },
  moderate: { color: 'text-orange-600', bg: 'bg-orange-100', bar: 'bg-orange-500', border: 'border-orange-200' },
  severe:   { color: 'text-red-600',    bg: 'bg-red-100',    bar: 'bg-red-500',    border: 'border-red-200' },
};

export default function ResultPage() {
  const { id } = useParams();
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assessmentService.getResultById(id)
      .then(res => setResult(res.data))
      .catch(() => router.push('/assessment'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  if (!result) return null;

  const { quiz, score, max_score, percentage, score_range, completed_at } = result;
  const severity = score_range?.severity || 'minimal';
  const config = SEVERITY_CONFIG[severity];
  const date = new Date(completed_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* Result card */}
          <Card className={`border-2 ${config.border} shadow-md rounded-2xl overflow-hidden`}>
            {/* Top banner */}
            <div className={`${config.bg} p-6 text-center`}>
              <span className="text-5xl block mb-2">{quiz.icon}</span>
              <h1 className="text-xl font-bold text-slate-800">{quiz.title}</h1>
              <p className="text-sm text-slate-500 mt-0.5">{date}</p>
            </div>

            <CardContent className="p-6">
              {/* Score */}
              <div className="text-center mb-6">
                <div className={`text-5xl font-bold ${config.color} mb-1`}>
                  {percentage}%
                </div>
                <p className="text-slate-400 text-sm">
                  Score: {score} / {max_score}
                </p>
              </div>

              {/* Progress bar */}
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
                <motion.div
                  className={`h-full rounded-full ${config.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>

              {/* Score range label */}
              {score_range && (
                <div className={`text-center mb-5`}>
                  <Badge className={`${config.bg} ${config.color} border ${config.border} text-sm px-4 py-1`}>
                    {score_range.label}
                  </Badge>
                </div>
              )}

              {/* Description */}
              {score_range?.description && (
                <p className="text-slate-600 text-sm text-center mb-5 leading-relaxed">
                  {score_range.description}
                </p>
              )}

              {/* Recommendation */}
              {score_range?.recommendation && (
                <div className={`${config.bg} border ${config.border} rounded-xl p-4 mb-5`}>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                    Recommendation
                  </p>
                  <p className={`text-sm ${config.color} leading-relaxed`}>
                    {score_range.recommendation}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/consultant" className="flex-1">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book a Consultant
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push(`/assessment/${quiz.slug}`)}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Answer review */}
          {result.answers && Object.keys(result.answers).length > 0 && (
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Your Responses
                </h2>
                <div className="space-y-3">
                  {Object.entries(result.answers).map(([qId, ans], i) => (
                    <div key={qId} className="flex gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-slate-600 mb-0.5">{ans.question}</p>
                        <p className="text-slate-400 text-xs">
                          {ans.answer}
                          <span className="ml-2 text-slate-300">({ans.score} pts)</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Other assessments */}
          <div className="text-center">
            <Link href="/assessment">
              <Button variant="ghost" className="text-blue-600">
                Take Another Assessment <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}