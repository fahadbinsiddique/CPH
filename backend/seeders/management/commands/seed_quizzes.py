from django.core.management.base import BaseCommand
from assessments.models import Quiz, Question, AnswerOption, ScoreRange


QUIZ_DATA = [
    {
        'title': 'Stress Assessment',
        'slug': 'stress-assessment',
        'category': 'stress',
        'icon': '😤',
        'description': 'Measure your current stress levels with this quick assessment.',
        'instructions': 'Answer each question based on how you have felt over the past 2 weeks. There are no right or wrong answers.',
        'duration_minutes': 5,
        'questions': [
            {
                'text': 'How often have you felt unable to control important things in your life?',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Almost Never', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Fairly Often', 'score': 3},
                    {'text': 'Very Often', 'score': 4},
                ]
            },
            {
                'text': 'How often have you felt nervous or stressed?',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Almost Never', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Fairly Often', 'score': 3},
                    {'text': 'Very Often', 'score': 4},
                ]
            },
            {
                'text': 'How often have you felt difficulties were piling up so high that you could not overcome them?',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Almost Never', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Fairly Often', 'score': 3},
                    {'text': 'Very Often', 'score': 4},
                ]
            },
            {
                'text': 'How often have you felt confident about your ability to handle personal problems?',
                'options': [
                    {'text': 'Very Often', 'score': 0},
                    {'text': 'Fairly Often', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Almost Never', 'score': 3},
                    {'text': 'Never', 'score': 4},
                ]
            },
            {
                'text': 'How often have you been able to control irritations in your life?',
                'options': [
                    {'text': 'Very Often', 'score': 0},
                    {'text': 'Fairly Often', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Almost Never', 'score': 3},
                    {'text': 'Never', 'score': 4},
                ]
            },
            {
                'text': 'How often have you felt that things were going your way?',
                'options': [
                    {'text': 'Very Often', 'score': 0},
                    {'text': 'Fairly Often', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Almost Never', 'score': 3},
                    {'text': 'Never', 'score': 4},
                ]
            },
            {
                'text': 'How often have you been upset because of something that happened unexpectedly?',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Almost Never', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Fairly Often', 'score': 3},
                    {'text': 'Very Often', 'score': 4},
                ]
            },
            {
                'text': 'How often have you felt on top of things?',
                'options': [
                    {'text': 'Very Often', 'score': 0},
                    {'text': 'Fairly Often', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Almost Never', 'score': 3},
                    {'text': 'Never', 'score': 4},
                ]
            },
            {
                'text': 'How often have you been angered because of things that were outside your control?',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Almost Never', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Fairly Often', 'score': 3},
                    {'text': 'Very Often', 'score': 4},
                ]
            },
            {
                'text': 'How often have you felt that you could not cope with all the things you had to do?',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Almost Never', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Fairly Often', 'score': 3},
                    {'text': 'Very Often', 'score': 4},
                ]
            },
        ],
        'score_ranges': [
            {'label': 'Low Stress', 'severity': 'minimal', 'min_score': 0, 'max_score': 13, 'color': 'green',
             'description': 'You are managing stress well.',
             'recommendation': 'Keep maintaining your healthy habits. Regular exercise and mindfulness can help sustain your wellbeing.'},
            {'label': 'Moderate Stress', 'severity': 'mild', 'min_score': 14, 'max_score': 26, 'color': 'yellow',
             'description': 'You are experiencing a moderate level of stress.',
             'recommendation': 'Consider stress management techniques such as meditation, regular breaks, and talking to someone you trust.'},
            {'label': 'High Stress', 'severity': 'moderate', 'min_score': 27, 'max_score': 33, 'color': 'orange',
             'description': 'Your stress levels are quite high.',
             'recommendation': 'It would be beneficial to speak with a mental health professional. Consider booking a session with one of our consultants.'},
            {'label': 'Severe Stress', 'severity': 'severe', 'min_score': 34, 'max_score': 40, 'color': 'red',
             'description': 'You are experiencing severe stress that needs attention.',
             'recommendation': 'We strongly recommend consulting a mental health professional as soon as possible. Please book an appointment with one of our consultants.'},
        ]
    },
    {
        'title': 'Anxiety Assessment',
        'slug': 'anxiety-assessment',
        'category': 'anxiety',
        'icon': '😰',
        'description': 'Evaluate your anxiety levels using the GAD-7 scale.',
        'instructions': 'Over the last 2 weeks, how often have you been bothered by the following problems?',
        'duration_minutes': 4,
        'questions': [
            {
                'text': 'Feeling nervous, anxious, or on edge',
                'options': [
                    {'text': 'Not at all', 'score': 0},
                    {'text': 'Several days', 'score': 1},
                    {'text': 'More than half the days', 'score': 2},
                    {'text': 'Nearly every day', 'score': 3},
                ]
            },
            {
                'text': 'Not being able to stop or control worrying',
                'options': [
                    {'text': 'Not at all', 'score': 0},
                    {'text': 'Several days', 'score': 1},
                    {'text': 'More than half the days', 'score': 2},
                    {'text': 'Nearly every day', 'score': 3},
                ]
            },
            {
                'text': 'Worrying too much about different things',
                'options': [
                    {'text': 'Not at all', 'score': 0},
                    {'text': 'Several days', 'score': 1},
                    {'text': 'More than half the days', 'score': 2},
                    {'text': 'Nearly every day', 'score': 3},
                ]
            },
            {
                'text': 'Trouble relaxing',
                'options': [
                    {'text': 'Not at all', 'score': 0},
                    {'text': 'Several days', 'score': 1},
                    {'text': 'More than half the days', 'score': 2},
                    {'text': 'Nearly every day', 'score': 3},
                ]
            },
            {
                'text': 'Being so restless that it is hard to sit still',
                'options': [
                    {'text': 'Not at all', 'score': 0},
                    {'text': 'Several days', 'score': 1},
                    {'text': 'More than half the days', 'score': 2},
                    {'text': 'Nearly every day', 'score': 3},
                ]
            },
            {
                'text': 'Becoming easily annoyed or irritable',
                'options': [
                    {'text': 'Not at all', 'score': 0},
                    {'text': 'Several days', 'score': 1},
                    {'text': 'More than half the days', 'score': 2},
                    {'text': 'Nearly every day', 'score': 3},
                ]
            },
            {
                'text': 'Feeling afraid as if something awful might happen',
                'options': [
                    {'text': 'Not at all', 'score': 0},
                    {'text': 'Several days', 'score': 1},
                    {'text': 'More than half the days', 'score': 2},
                    {'text': 'Nearly every day', 'score': 3},
                ]
            },
        ],
        'score_ranges': [
            {'label': 'Minimal Anxiety', 'severity': 'minimal', 'min_score': 0, 'max_score': 4, 'color': 'green',
             'description': 'Your anxiety levels are minimal.',
             'recommendation': 'Continue your current healthy routines. Practice mindfulness and regular exercise to maintain your mental wellbeing.'},
            {'label': 'Mild Anxiety', 'severity': 'mild', 'min_score': 5, 'max_score': 9, 'color': 'yellow',
             'description': 'You show signs of mild anxiety.',
             'recommendation': 'Try relaxation techniques such as deep breathing, yoga, or journaling. Monitor your symptoms over the next few weeks.'},
            {'label': 'Moderate Anxiety', 'severity': 'moderate', 'min_score': 10, 'max_score': 14, 'color': 'orange',
             'description': 'You are experiencing moderate anxiety.',
             'recommendation': 'Consider speaking with a mental health professional. Therapy can be very effective for managing anxiety at this level.'},
            {'label': 'Severe Anxiety', 'severity': 'severe', 'min_score': 15, 'max_score': 21, 'color': 'red',
             'description': 'Your anxiety levels are severe.',
             'recommendation': 'Please seek professional help promptly. Book an appointment with one of our consultants for proper evaluation and support.'},
        ]
    },
    {
        'title': 'Depression Screening',
        'slug': 'depression-screening',
        'category': 'depression',
        'icon': '😔',
        'description': 'Screen for depression symptoms using the PHQ-9 scale.',
        'instructions': 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
        'duration_minutes': 5,
        'questions': [
            {
                'text': 'Little interest or pleasure in doing things',
                'options': [
                    {'text': 'Not at all', 'score': 0},
                    {'text': 'Several days', 'score': 1},
                    {'text': 'More than half the days', 'score': 2},
                    {'text': 'Nearly every day', 'score': 3},
                ]
            },
            {
                'text': 'Feeling down, depressed, or hopeless',
                'options': [
                    {'text': 'Not at all', 'score': 0},
                    {'text': 'Several days', 'score': 1},
                    {'text': 'More than half the days', 'score': 2},
                    {'text': 'Nearly every day', 'score': 3},
                ]
            },
            {
                'text': 'Trouble falling or staying asleep, or sleeping too much',
                'options': [
                    {'text': 'Not at all', 'score': 0},
                    {'text': 'Several days', 'score': 1},
                    {'text': 'More than half the days', 'score': 2},
                    {'text': 'Nearly every day', 'score': 3},
                ]
            },
            {
                'text': 'Feeling tired or having little energy',
                'options': [
                    {'text': 'Not at all', 'score': 0},
                    {'text': 'Several days', 'score': 1},
                    {'text': 'More than half the days', 'score': 2},
                    {'text': 'Nearly every day', 'score': 3},
                ]
            },
            {
                'text': 'Poor appetite or overeating',
                'options': [
                    {'text': 'Not at all', 'score': 0},
                    {'text': 'Several days', 'score': 1},
                    {'text': 'More than half the days', 'score': 2},
                    {'text': 'Nearly every day', 'score': 3},
                ]
            },
            {
                'text': 'Feeling bad about yourself, or that you are a failure',
                'options': [
                    {'text': 'Not at all', 'score': 0},
                    {'text': 'Several days', 'score': 1},
                    {'text': 'More than half the days', 'score': 2},
                    {'text': 'Nearly every day', 'score': 3},
                ]
            },
            {
                'text': 'Trouble concentrating on things such as reading or watching television',
                'options': [
                    {'text': 'Not at all', 'score': 0},
                    {'text': 'Several days', 'score': 1},
                    {'text': 'More than half the days', 'score': 2},
                    {'text': 'Nearly every day', 'score': 3},
                ]
            },
            {
                'text': 'Moving or speaking so slowly that other people could have noticed, or the opposite',
                'options': [
                    {'text': 'Not at all', 'score': 0},
                    {'text': 'Several days', 'score': 1},
                    {'text': 'More than half the days', 'score': 2},
                    {'text': 'Nearly every day', 'score': 3},
                ]
            },
            {
                'text': 'Thoughts that you would be better off dead, or thoughts of hurting yourself',
                'options': [
                    {'text': 'Not at all', 'score': 0},
                    {'text': 'Several days', 'score': 1},
                    {'text': 'More than half the days', 'score': 2},
                    {'text': 'Nearly every day', 'score': 3},
                ]
            },
        ],
        'score_ranges': [
            {'label': 'Minimal Depression', 'severity': 'minimal', 'min_score': 0, 'max_score': 4, 'color': 'green',
             'description': 'You show minimal signs of depression.',
             'recommendation': 'Keep up your self-care routines. Stay connected with friends and family, and engage in activities you enjoy.'},
            {'label': 'Mild Depression', 'severity': 'mild', 'min_score': 5, 'max_score': 9, 'color': 'yellow',
             'description': 'You show signs of mild depression.',
             'recommendation': 'Consider lifestyle changes such as regular exercise, better sleep habits, and social engagement. Monitor how you feel over the next few weeks.'},
            {'label': 'Moderate Depression', 'severity': 'moderate', 'min_score': 10, 'max_score': 14, 'color': 'orange',
             'description': 'You are showing signs of moderate depression.',
             'recommendation': 'We recommend speaking with a mental health professional. Therapy and/or medication can be very effective at this stage.'},
            {'label': 'Moderately Severe', 'severity': 'severe', 'min_score': 15, 'max_score': 19, 'color': 'red',
             'description': 'You are experiencing moderately severe depression.',
             'recommendation': 'Please consult a mental health professional as soon as possible. Book an appointment with one of our consultants today.'},
            {'label': 'Severe Depression', 'severity': 'severe', 'min_score': 20, 'max_score': 27, 'color': 'red',
             'description': 'You are experiencing severe depression.',
             'recommendation': 'Immediate professional support is strongly recommended. Please reach out to a consultant or emergency mental health services.'},
        ]
    },
    {
        'title': 'Burnout Assessment',
        'slug': 'burnout-assessment',
        'category': 'burnout',
        'icon': '🔥',
        'description': 'Assess your level of workplace and personal burnout.',
        'instructions': 'Think about your work and daily life over the past month. Answer honestly for the most accurate results.',
        'duration_minutes': 6,
        'questions': [
            {
                'text': 'I feel emotionally drained from my work',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Rarely', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Often', 'score': 3},
                    {'text': 'Always', 'score': 4},
                ]
            },
            {
                'text': 'I feel used up at the end of the workday',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Rarely', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Often', 'score': 3},
                    {'text': 'Always', 'score': 4},
                ]
            },
            {
                'text': 'I feel tired when I get up in the morning and have to face another day',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Rarely', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Often', 'score': 3},
                    {'text': 'Always', 'score': 4},
                ]
            },
            {
                'text': 'Working with people all day is really a strain for me',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Rarely', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Often', 'score': 3},
                    {'text': 'Always', 'score': 4},
                ]
            },
            {
                'text': 'I feel burned out from my work',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Rarely', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Often', 'score': 3},
                    {'text': 'Always', 'score': 4},
                ]
            },
            {
                'text': 'I feel frustrated by my job or daily responsibilities',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Rarely', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Often', 'score': 3},
                    {'text': 'Always', 'score': 4},
                ]
            },
            {
                'text': 'I feel I am working too hard in my role',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Rarely', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Often', 'score': 3},
                    {'text': 'Always', 'score': 4},
                ]
            },
            {
                'text': 'I have become less interested in my work since I started this job',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Rarely', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Often', 'score': 3},
                    {'text': 'Always', 'score': 4},
                ]
            },
            {
                'text': 'I feel my productivity and effectiveness have declined',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Rarely', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Often', 'score': 3},
                    {'text': 'Always', 'score': 4},
                ]
            },
            {
                'text': 'I find it difficult to disconnect from work even during personal time',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Rarely', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Often', 'score': 3},
                    {'text': 'Always', 'score': 4},
                ]
            },
        ],
        'score_ranges': [
            {'label': 'No Burnout', 'severity': 'minimal', 'min_score': 0, 'max_score': 9, 'color': 'green',
             'description': 'You show no significant signs of burnout.',
             'recommendation': 'Great job maintaining work-life balance! Continue setting healthy boundaries and taking regular breaks.'},
            {'label': 'Mild Burnout', 'severity': 'mild', 'min_score': 10, 'max_score': 19, 'color': 'yellow',
             'description': 'You show early signs of burnout.',
             'recommendation': 'Pay attention to your energy levels. Schedule regular breaks, prioritize sleep, and make time for activities you enjoy.'},
            {'label': 'Moderate Burnout', 'severity': 'moderate', 'min_score': 20, 'max_score': 29, 'color': 'orange',
             'description': 'You are experiencing moderate burnout.',
             'recommendation': 'Consider speaking with a counselor about work-life balance strategies. It may also help to talk to your manager about workload.'},
            {'label': 'Severe Burnout', 'severity': 'severe', 'min_score': 30, 'max_score': 40, 'color': 'red',
             'description': 'You are experiencing severe burnout.',
             'recommendation': 'Please seek professional support immediately. Severe burnout can have serious health consequences. Book an appointment with one of our consultants.'},
        ]
    },
]


class Command(BaseCommand):
    help = 'Seed assessment quizzes with questions and score ranges'

    def handle(self, *args, **kwargs):
        for quiz_data in QUIZ_DATA:
            quiz, created = Quiz.objects.get_or_create(
                slug=quiz_data['slug'],
                defaults={
                    'title': quiz_data['title'],
                    'category': quiz_data['category'],
                    'description': quiz_data['description'],
                    'instructions': quiz_data['instructions'],
                    'icon': quiz_data['icon'],
                    'duration_minutes': quiz_data['duration_minutes'],
                }
            )

            if created:
                # Questions
                for i, q_data in enumerate(quiz_data['questions']):
                    question = Question.objects.create(
                        quiz=quiz,
                        text=q_data['text'],
                        order=i + 1
                    )
                    for j, opt in enumerate(q_data['options']):
                        AnswerOption.objects.create(
                            question=question,
                            text=opt['text'],
                            score=opt['score'],
                            order=j + 1
                        )

                # Score ranges
                for sr in quiz_data['score_ranges']:
                    ScoreRange.objects.create(quiz=quiz, **sr)

                self.stdout.write(
                    self.style.SUCCESS(f'Created: {quiz.title}')
                )
            else:
                self.stdout.write(f'Already exists: {quiz.title}')

        self.stdout.write(self.style.SUCCESS('Done!'))