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
        'title': 'GAD-7 Anxiety Assessment',
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
        'title': 'PHQ-9 Depression Screening',
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
    {
        'title': 'PSS-10 Perceived Stress',
        'slug': 'pss-10-perceived-stress',
        'category': 'stress',
        'icon': '😮‍💨',
        'description': 'The Perceived Stress Scale (PSS-10) measures how much you perceive life situations as stressful.',
        'instructions': 'Over the last month, how often have you felt or thought the following way? Answer honestly for the most accurate result.',
        'duration_minutes': 5,
        'questions': [
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
                'text': 'How often have you felt that you were unable to control the important things in your life?',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Almost Never', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Fairly Often', 'score': 3},
                    {'text': 'Very Often', 'score': 4},
                ]
            },
            {
                'text': 'How often have you felt nervous and stressed?',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Almost Never', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Fairly Often', 'score': 3},
                    {'text': 'Very Often', 'score': 4},
                ]
            },
            {
                'text': 'How often have you felt confident about your ability to handle your personal problems?',
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
                'text': 'How often have you found that you could not cope with all the things that you had to do?',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Almost Never', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Fairly Often', 'score': 3},
                    {'text': 'Very Often', 'score': 4},
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
                'text': 'How often have you felt that you were on top of things?',
                'options': [
                    {'text': 'Very Often', 'score': 0},
                    {'text': 'Fairly Often', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Almost Never', 'score': 3},
                    {'text': 'Never', 'score': 4},
                ]
            },
            {
                'text': 'How often have you been angered because of things that were outside of your control?',
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
        ],
        'score_ranges': [
            {'label': 'Low Stress', 'severity': 'minimal', 'min_score': 0, 'max_score': 13, 'color': 'green',
             'description': 'You are handling daily pressures well.',
             'recommendation': 'Keep up your balanced routines. Regular exercise, good sleep, and mindfulness help sustain this.'},
            {'label': 'Moderate Stress', 'severity': 'mild', 'min_score': 14, 'max_score': 26, 'color': 'yellow',
             'description': 'You are experiencing a moderate level of stress.',
             'recommendation': 'Try relaxation techniques such as breathing exercises, journaling, and scheduling regular breaks.'},
            {'label': 'High Stress', 'severity': 'moderate', 'min_score': 27, 'max_score': 33, 'color': 'orange',
             'description': 'Your stress levels are high.',
             'recommendation': 'It would be helpful to speak with a mental health professional about managing stress. Consider booking a session.'},
            {'label': 'Severe Stress', 'severity': 'severe', 'min_score': 34, 'max_score': 40, 'color': 'red',
             'description': 'You are experiencing severe stress that needs attention.',
             'recommendation': 'We strongly recommend consulting a mental health professional as soon as possible. Book an appointment today.'},
        ]
    },
    {
        'title': 'Insomnia Severity Index (ISI)',
        'slug': 'insomnia-severity-index',
        'category': 'sleep',
        'icon': '😴',
        'description': 'The Insomnia Severity Index (ISI) screens for the severity of insomnia over the past 2 weeks.',
        'instructions': 'For each question, choose the option that best describes your sleep over the last 2 weeks.',
        'duration_minutes': 4,
        'questions': [
            {
                'text': 'Difficulty falling asleep',
                'options': [
                    {'text': 'None', 'score': 0},
                    {'text': 'Mild', 'score': 1},
                    {'text': 'Moderate', 'score': 2},
                    {'text': 'Severe', 'score': 3},
                    {'text': 'Very severe', 'score': 4},
                ]
            },
            {
                'text': 'Difficulty staying asleep',
                'options': [
                    {'text': 'None', 'score': 0},
                    {'text': 'Mild', 'score': 1},
                    {'text': 'Moderate', 'score': 2},
                    {'text': 'Severe', 'score': 3},
                    {'text': 'Very severe', 'score': 4},
                ]
            },
            {
                'text': 'Problems waking up too early',
                'options': [
                    {'text': 'None', 'score': 0},
                    {'text': 'Mild', 'score': 1},
                    {'text': 'Moderate', 'score': 2},
                    {'text': 'Severe', 'score': 3},
                    {'text': 'Very severe', 'score': 4},
                ]
            },
            {
                'text': 'How SATISFIED/dissatisfied are you with your current sleep pattern?',
                'options': [
                    {'text': 'Very satisfied', 'score': 0},
                    {'text': 'Satisfied', 'score': 1},
                    {'text': 'Neutral', 'score': 2},
                    {'text': 'Dissatisfied', 'score': 3},
                    {'text': 'Very dissatisfied', 'score': 4},
                ]
            },
            {
                'text': 'To what extent do you consider your sleep problem to INTERFERE with your daily functioning?',
                'options': [
                    {'text': 'Not at all', 'score': 0},
                    {'text': 'A little', 'score': 1},
                    {'text': 'Somewhat', 'score': 2},
                    {'text': 'Much', 'score': 3},
                    {'text': 'Very much', 'score': 4},
                ]
            },
            {
                'text': 'How NOTICEABLE to others do you think your sleep problem is in terms of impairing the quality of your life?',
                'options': [
                    {'text': 'Not at all noticeable', 'score': 0},
                    {'text': 'A little', 'score': 1},
                    {'text': 'Somewhat', 'score': 2},
                    {'text': 'Much', 'score': 3},
                    {'text': 'Very much noticeable', 'score': 4},
                ]
            },
            {
                'text': 'How WORRIED/distressed are you about your current sleep problem?',
                'options': [
                    {'text': 'Not at all', 'score': 0},
                    {'text': 'A little', 'score': 1},
                    {'text': 'Somewhat', 'score': 2},
                    {'text': 'Much', 'score': 3},
                    {'text': 'Very much', 'score': 4},
                ]
            },
        ],
        'score_ranges': [
            {'label': 'No Clinically Significant Insomnia', 'severity': 'minimal', 'min_score': 0, 'max_score': 7, 'color': 'green',
             'description': 'Your sleep is generally healthy.',
             'recommendation': 'Maintain a consistent sleep schedule, limit caffeine before bed, and keep a relaxing wind-down routine.'},
            {'label': 'Subthreshold Insomnia', 'severity': 'mild', 'min_score': 8, 'max_score': 14, 'color': 'yellow',
             'description': 'You show some signs of insomnia.',
             'recommendation': 'Improve sleep hygiene: keep the bedroom dark and cool, avoid screens before bed, and try a consistent bedtime.'},
            {'label': 'Clinical Insomnia (Moderate)', 'severity': 'moderate', 'min_score': 15, 'max_score': 21, 'color': 'orange',
             'description': 'Your insomnia symptoms are clinically significant.',
             'recommendation': 'Consider speaking with a healthcare professional about cognitive behavioural therapy for insomnia (CBT-I).'},
            {'label': 'Clinical Insomnia (Severe)', 'severity': 'severe', 'min_score': 22, 'max_score': 28, 'color': 'red',
             'description': 'Your insomnia is severe.',
             'recommendation': 'Please consult a healthcare professional soon. Sleep problems of this level deserve proper evaluation and treatment.'},
        ]
    },
    {
        'title': 'WHO-5 Well-Being Index',
        'slug': 'who-5-wellbeing-index',
        'category': 'wellbeing',
        'icon': '🌿',
        'description': 'The WHO-5 measures general psychological well-being over the past 2 weeks.',
        'instructions': 'Over the last 2 weeks, how much of the time have you felt the following?',
        'duration_minutes': 2,
        'questions': [
            {
                'text': 'I have felt cheerful and in good spirits',
                'options': [
                    {'text': 'At no time', 'score': 0},
                    {'text': 'Some of the time', 'score': 1},
                    {'text': 'Less than half of the time', 'score': 2},
                    {'text': 'More than half of the time', 'score': 3},
                    {'text': 'Most of the time', 'score': 4},
                    {'text': 'All of the time', 'score': 5},
                ]
            },
            {
                'text': 'I have felt calm and relaxed',
                'options': [
                    {'text': 'At no time', 'score': 0},
                    {'text': 'Some of the time', 'score': 1},
                    {'text': 'Less than half of the time', 'score': 2},
                    {'text': 'More than half of the time', 'score': 3},
                    {'text': 'Most of the time', 'score': 4},
                    {'text': 'All of the time', 'score': 5},
                ]
            },
            {
                'text': 'I have felt active and vigorous',
                'options': [
                    {'text': 'At no time', 'score': 0},
                    {'text': 'Some of the time', 'score': 1},
                    {'text': 'Less than half of the time', 'score': 2},
                    {'text': 'More than half of the time', 'score': 3},
                    {'text': 'Most of the time', 'score': 4},
                    {'text': 'All of the time', 'score': 5},
                ]
            },
            {
                'text': 'I woke up feeling fresh and rested',
                'options': [
                    {'text': 'At no time', 'score': 0},
                    {'text': 'Some of the time', 'score': 1},
                    {'text': 'Less than half of the time', 'score': 2},
                    {'text': 'More than half of the time', 'score': 3},
                    {'text': 'Most of the time', 'score': 4},
                    {'text': 'All of the time', 'score': 5},
                ]
            },
            {
                'text': 'My daily life has been filled with things that interest me',
                'options': [
                    {'text': 'At no time', 'score': 0},
                    {'text': 'Some of the time', 'score': 1},
                    {'text': 'Less than half of the time', 'score': 2},
                    {'text': 'More than half of the time', 'score': 3},
                    {'text': 'Most of the time', 'score': 4},
                    {'text': 'All of the time', 'score': 5},
                ]
            },
        ],
        'score_ranges': [
            {'label': 'Low Well-Being', 'severity': 'moderate', 'min_score': 0, 'max_score': 12, 'color': 'orange',
             'description': 'Your well-being may be low.',
             'recommendation': 'It is worth paying attention to how you feel. Consider reaching out to a mental health professional for support.'},
            {'label': 'Moderate Well-Being', 'severity': 'mild', 'min_score': 13, 'max_score': 17, 'color': 'yellow',
             'description': 'Your well-being is moderate.',
             'recommendation': 'Nurture activities that energise you — time with loved ones, movement, rest, and small daily wins.'},
            {'label': 'Good Well-Being', 'severity': 'minimal', 'min_score': 18, 'max_score': 25, 'color': 'green',
             'description': 'Your psychological well-being is good.',
             'recommendation': 'Great work. Keep prioritising the habits that keep you feeling balanced and connected.'},
        ]
    },
    {
        'title': 'Adult ADHD Self-Report (ASRS-6)',
        'slug': 'adult-adhd-self-report',
        'category': 'adhd',
        'icon': '🧠',
        'description': 'The ASRS-6 screens for adult ADHD symptoms over the past 6 months.',
        'instructions': 'Over the past 6 months, how often have you experienced the following?',
        'duration_minutes': 3,
        'questions': [
            {
                'text': 'How often do you have trouble wrapping up the final details of a project once the challenging parts have been done?',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Rarely', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Often', 'score': 3},
                    {'text': 'Very often', 'score': 4},
                ]
            },
            {
                'text': 'How often do you have difficulty getting things in order when you have to do a task that requires organization?',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Rarely', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Often', 'score': 3},
                    {'text': 'Very often', 'score': 4},
                ]
            },
            {
                'text': 'How often do you have problems remembering appointments or obligations?',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Rarely', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Often', 'score': 3},
                    {'text': 'Very often', 'score': 4},
                ]
            },
            {
                'text': 'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Rarely', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Often', 'score': 3},
                    {'text': 'Very often', 'score': 4},
                ]
            },
            {
                'text': 'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Rarely', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Often', 'score': 3},
                    {'text': 'Very often', 'score': 4},
                ]
            },
            {
                'text': 'How often do you feel overly active and compelled to do things, like you were driven by a motor?',
                'options': [
                    {'text': 'Never', 'score': 0},
                    {'text': 'Rarely', 'score': 1},
                    {'text': 'Sometimes', 'score': 2},
                    {'text': 'Often', 'score': 3},
                    {'text': 'Very often', 'score': 4},
                ]
            },
        ],
        'score_ranges': [
            {'label': 'Low Likelihood of ADHD', 'severity': 'minimal', 'min_score': 0, 'max_score': 9, 'color': 'green',
             'description': 'You report few ADHD-related symptoms.',
             'recommendation': 'Continue using the organisational habits and routines that work for you.'},
            {'label': 'Some Symptoms Present', 'severity': 'mild', 'min_score': 10, 'max_score': 13, 'color': 'yellow',
             'description': 'You report some ADHD-related symptoms.',
             'recommendation': 'Consider strategies like written checklists, reminders, and breaking tasks into smaller steps.'},
            {'label': 'High Likelihood of ADHD', 'severity': 'moderate', 'min_score': 14, 'max_score': 24, 'color': 'orange',
             'description': 'You report symptoms consistent with adult ADHD.',
             'recommendation': 'This is a screening tool, not a diagnosis. Please discuss these symptoms with a qualified professional for a full evaluation.'},
        ]
    },
    {
        'title': 'UCLA Loneliness Scale (ULS-3)',
        'slug': 'ucla-loneliness-scale',
        'category': 'social',
        'icon': '🤝',
        'description': 'A short 3-item scale measuring feelings of loneliness and connection.',
        'instructions': 'Answer how often you feel the following way.',
        'duration_minutes': 1,
        'questions': [
            {
                'text': 'How often do you feel that you lack companionship?',
                'options': [
                    {'text': 'Hardly ever', 'score': 1},
                    {'text': 'Some of the time', 'score': 2},
                    {'text': 'Often', 'score': 3},
                ]
            },
            {
                'text': 'How often do you feel left out?',
                'options': [
                    {'text': 'Hardly ever', 'score': 1},
                    {'text': 'Some of the time', 'score': 2},
                    {'text': 'Often', 'score': 3},
                ]
            },
            {
                'text': 'How often do you feel isolated from others?',
                'options': [
                    {'text': 'Hardly ever', 'score': 1},
                    {'text': 'Some of the time', 'score': 2},
                    {'text': 'Often', 'score': 3},
                ]
            },
        ],
        'score_ranges': [
            {'label': 'Low Loneliness', 'severity': 'minimal', 'min_score': 3, 'max_score': 5, 'color': 'green',
             'description': 'You feel generally connected to others.',
             'recommendation': 'Keep nurturing your relationships — small regular check-ins make a big difference.'},
            {'label': 'Moderate Loneliness', 'severity': 'mild', 'min_score': 6, 'max_score': 7, 'color': 'yellow',
             'description': 'You sometimes feel lonely.',
             'recommendation': 'Try reaching out to a friend or family member this week, or joining a group aligned with your interests.'},
            {'label': 'High Loneliness', 'severity': 'severe', 'min_score': 8, 'max_score': 9, 'color': 'red',
             'description': 'You frequently feel lonely.',
             'recommendation': 'Loneliness is common and treatable. Consider speaking with a therapist to explore ways to rebuild connection.'},
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

            # Keep base fields in sync even for quizzes that already exist.
            Quiz.objects.filter(pk=quiz.pk).update(
                title=quiz_data['title'],
                category=quiz_data['category'],
                description=quiz_data['description'],
                instructions=quiz_data['instructions'],
                icon=quiz_data['icon'],
                duration_minutes=quiz_data['duration_minutes'],
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