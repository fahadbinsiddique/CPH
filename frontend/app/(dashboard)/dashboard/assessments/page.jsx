'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList, TrendingUp, RotateCcw,
  Loader2, ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AuthGuard from '@/components/shared/AuthGuard';
import { assessmentService } from '@/services/assessmentService';

const SEVERITY_CONFIG = {
  minimal:  { color: 'text-green-600',  bg: 'bg-green-100',  label: 'Minimal' },
  mild:     { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Mild' },
  moderate: { color: 'text-orange-600', bg: 'bg-orange-100', label: 'Moderate' },
  severe:   { color: 'text-red-600',    bg: 'bg-red-100',    label: 'Severe' },
};

export default function AssessmentHistoryPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assessmentService.getResults()
      .then(res => setResults(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthGuard>
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Assessment History</h1>
            <p className="text-slate-400 text-sm">{results.length} assessments taken</p>
          </div>
          <Link href="/assessment">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ClipboardList className="w-4 h-4 mr-2" />
              Take New
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            {results.map((result, i) => {
              const severity = result.score_range?.severity || 'minimal';
              const config = SEVERITY_CONFIG[severity];
              const date = new Date(result.completed_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
              });

              return (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="border border-slate-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center text-2xl flex-shrink-0`}>
                        {result.quiz.icon}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800">{result.quiz.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs font-medium ${config.color}`}>
                            {result.score_range?.label || 'Completed'}
                          </span>
                          <span className="text-xs text-slate-400">{date}</span>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right flex-shrink-0">
                        <p className={`text-xl font-bold ${config.color}`}>
                          {result.percentage}%
                        </p>
                        <p className="text-xs text-slate-400">
                          {result.score}/{result.max_score}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1.5 flex-shrink-0">
                        <Link href={`/assessment/result/${result.id}`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600">
                            <TrendingUp className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/assessment/${result.quiz.slug}`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600">
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-12 text-center">
              <ClipboardList className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 mb-4">No assessments taken yet</p>
              <Link href="/assessment">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Take Your First Assessment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthGuard>
  );
}