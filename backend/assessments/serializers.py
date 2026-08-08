from rest_framework import serializers
from .models import Quiz, Question, AnswerOption, ScoreRange, QuizResult


class AnswerOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerOption
        fields = ['id', 'text', 'score', 'order']


class QuestionSerializer(serializers.ModelSerializer):
    options = AnswerOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'order', 'options']


class ScoreRangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoreRange
        fields = [
            'id', 'label', 'severity',
            'min_score', 'max_score',
            'description', 'recommendation', 'color'
        ]


class QuizListSerializer(serializers.ModelSerializer):
    question_count = serializers.ReadOnlyField()

    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'slug', 'category',
            'description', 'icon', 'duration_minutes',
            'question_count', 'is_active',
        ]


class QuizDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    score_ranges = ScoreRangeSerializer(many=True, read_only=True)
    question_count = serializers.ReadOnlyField()

    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'slug', 'category',
            'description', 'instructions', 'icon',
            'duration_minutes', 'question_count',
            'questions', 'score_ranges',
        ]


class QuizSubmitSerializer(serializers.Serializer):
    quiz_id = serializers.IntegerField()
    answers = serializers.DictField(
        child=serializers.IntegerField()
    )
    # answers = { "question_id": "option_id", ... }

    def validate(self, attrs):
        from .models import Quiz
        try:
            quiz = Quiz.objects.prefetch_related(
                'questions__options'
            ).get(pk=attrs['quiz_id'], is_active=True)
        except Quiz.DoesNotExist:
            raise serializers.ValidationError('Quiz not found.')

        attrs['quiz'] = quiz
        return attrs

    def save(self, user=None):
        quiz = self.validated_data['quiz']
        answers = self.validated_data['answers']

        total_score = 0
        max_score = 0
        answer_log = {}

        for question in quiz.questions.all():
            option_id = answers.get(str(question.id))
            if option_id:
                try:
                    option = question.options.get(pk=option_id)
                    total_score += option.score
                    answer_log[str(question.id)] = {
                        'question': question.text,
                        'answer': option.text,
                        'score': option.score,
                    }
                except AnswerOption.DoesNotExist:
                    pass

            # Max score = highest option score per question
            max_option = question.options.order_by('-score').first()
            if max_option:
                max_score += max_option.score

        # Find matching score range
        score_range = quiz.score_ranges.filter(
            min_score__lte=total_score,
            max_score__gte=total_score
        ).first()

        result = QuizResult.objects.create(
            user=user,
            quiz=quiz,
            score=total_score,
            max_score=max_score,
            score_range=score_range,
            answers=answer_log,
        )
        return result


class QuizResultSerializer(serializers.ModelSerializer):
    quiz = QuizListSerializer(read_only=True)
    score_range = ScoreRangeSerializer(read_only=True)
    percentage = serializers.ReadOnlyField()

    class Meta:
        model = QuizResult
        fields = [
            'id', 'quiz', 'score', 'max_score',
            'percentage', 'score_range',
            'answers', 'completed_at',
        ]