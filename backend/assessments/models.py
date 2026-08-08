from django.db import models
from django.conf import settings


class Quiz(models.Model):
    CATEGORY_CHOICES = [
        ('stress', 'Stress'),
        ('anxiety', 'Anxiety'),
        ('depression', 'Depression'),
        ('burnout', 'Burnout'),
        ('sleep', 'Sleep'),
        ('wellbeing', 'Wellbeing'),
        ('adhd', 'ADHD'),
        ('social', 'Social'),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField()
    instructions = models.TextField(blank=True)
    icon = models.CharField(max_length=10, default='😊')
    duration_minutes = models.PositiveIntegerField(default=5)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Quizzes'
        ordering = ['category']

    def __str__(self):
        return self.title

    @property
    def question_count(self):
        return self.questions.count()


class Question(models.Model):
    quiz = models.ForeignKey(
        Quiz, on_delete=models.CASCADE,
        related_name='questions'
    )
    text = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.quiz.title} — Q{self.order}"


class AnswerOption(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE,
        related_name='options'
    )
    text = models.CharField(max_length=255)
    score = models.PositiveIntegerField(default=0)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.text} ({self.score})"


class ScoreRange(models.Model):
    SEVERITY_CHOICES = [
        ('minimal', 'Minimal'),
        ('mild', 'Mild'),
        ('moderate', 'Moderate'),
        ('severe', 'Severe'),
    ]

    quiz = models.ForeignKey(
        Quiz, on_delete=models.CASCADE,
        related_name='score_ranges'
    )
    label = models.CharField(max_length=100)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    min_score = models.PositiveIntegerField()
    max_score = models.PositiveIntegerField()
    description = models.TextField()
    recommendation = models.TextField()
    color = models.CharField(max_length=20, default='green')

    class Meta:
        ordering = ['min_score']

    def __str__(self):
        return f"{self.quiz.title} — {self.label} ({self.min_score}-{self.max_score})"


class QuizResult(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='quiz_results'
    )
    quiz = models.ForeignKey(
        Quiz, on_delete=models.CASCADE,
        related_name='results'
    )
    score = models.PositiveIntegerField()
    max_score = models.PositiveIntegerField()
    score_range = models.ForeignKey(
        ScoreRange, on_delete=models.SET_NULL,
        null=True, blank=True
    )
    answers = models.JSONField(default=dict)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-completed_at']

    def __str__(self):
        user = self.user.email if self.user else 'Guest'
        return f"{user} — {self.quiz.title} ({self.score})"

    @property
    def percentage(self):
        if self.max_score == 0:
            return 0
        return round((self.score / self.max_score) * 100)