import re
import hashlib
import datetime

from django.core.management.base import BaseCommand
from django.utils.text import slugify

from cph_app.models import User
from consultants.models import Consultant, Specialization, ConsultantAvailability

# ---------------------------------------------------------------------------
# Dataset transcribed from the consultant list sheet.
# ---------------------------------------------------------------------------

CONSULTANTS = [
    {
        "name": "Jum Nazmul Hossain",
        "qualifications": (
            "Consultant Psychologist\n"
            "Bsc in Psychology(DU)\n"
            "MSc in Clinical Psychology (DU) ,MPhil (Preliminary)in Clinical Psychology\n"
            "MIAAP, MASPiH(UK), MIPPA, MRAPS (US), AffilMAPA (US)\n"
            "MAP (UK), FAAPL (US)"
        ),
        "specializations": (
            "Psychology, Law & Ethic\n"
            "Clinical and Community Psychology\n"
            "Forensic Psychology\n"
            "Psychological Training\n"
            "Psychological Assessment and Evaluation\n"
            "Professional Psychology\n"
            "Bangladeshi Drug Project\n"
            "Culture Sensitive Service"
        ),
        "interested_in": "",
        "phone": "",
        "active_in": "",
    },
    {
        "name": "Jakia Sultana",
        "qualifications": (
            "Consultant Psychologist\n"
            "MPhil (Preliminary) in Clinical Psychology\n"
            "MPhil Scholar ( Forensic Psychology)\n"
            "MSc in Clinical Psychology (DU)\n"
            "BSc in Psychology (DU)"
        ),
        "specializations": "",
        "interested_in": "",
        "phone": "",
        "active_in": "",
    },
    {
        "name": "Mrs. Liza Akhter",
        "qualifications": (
            "Lecturer at the Dept. of Clinical Psychology (DU)\n"
            "Clinical Psychologist\n"
            "MSc in Clinical Psychology (DU)\n"
            "BSc in Psychology (DU)"
        ),
        "specializations": (
            "Cognitive Behaviour Therapy\n"
            "Systematic Family Therapy\n"
            "Creative Therapy\n"
            "Mental Health Issues\n"
            "Women's Rise Group Therapy\n"
            "Anger Management\n"
            "Social Skills Training\n"
            "Mental Health & psychosocial Services\n"
            "Psychological First Aid"
        ),
        "interested_in": "",
        "phone": "01684949285",
        "active_in": "Tuesday\n4.00 PM",
    },
    {
        "name": "Mrs. Marzia",
        "qualifications": "Clinical Psychology",
        "specializations": "",
        "interested_in": "",
        "phone": "01923852813",
        "active_in": "Wednesday",
    },
    {
        "name": "Mr. Shuvashis Kumar Chatterjee",
        "qualifications": (
            "Deputy Director, Psychology, SCGC; Jahangirnagar University\n"
            "M.Phil in Clinical psychology (DU)\n"
            "MSc in Clinical psychology(DU)\n"
            "BSc in Psychology (RU)"
        ),
        "specializations": (
            "Anxiety & Panic Disorders\n"
            "Child & Adolescent Behavioral (ADHD, ODD & Impulse Control issues\n"
            "Depression & Mood Difficulties,Sleep Problem\n"
            "Trauma & Abuse Recovery\n"
            "Old Age Mental Health,Burnout & Caregiver Stress\n"
            "Relationship, Family Conflicts,Sexual Wellness & Intimacy Concerns\n"
            "Social Anxiety & Communication Skill\n"
            "Adult Adjustment & Stress\n"
            "Positive Parenting\n"
            "School-Based Mental Health Support"
        ),
        "interested_in": "",
        "phone": "01716492568",
        "active_in": "",
    },
    {
        "name": "Mr. Sagor Barua",
        "qualifications": (
            "Associate Clinical Psychologist\n"
            "BSc in Psychology (DU)\n"
            "MS in Educational Psychology (DU)\n"
            "MSc in Clinical & Health Psychology, Bangor University, UK\n"
            "PGT in Forensic Psychology (IPH)"
        ),
        "specializations": (
            "Clinical assessment\n"
            "Child and adolescent mental health\n"
            "Psychological wellbeing\n"
            "Therapeutic Intervention\n"
            "Psychoeducation\n"
            "Behavioral and emotional development\n"
            "Multidisciplinary mental health practice"
        ),
        "interested_in": "",
        "phone": "01825823664",
        "active_in": "",
    },
    {
        "name": "Mrs. Shawmpa",
        "qualifications": (
            "M.Phil in Clinical psychology (DU)\n"
            "MSc in Clinical psychology(DU)\n"
            "BSc in Psychology (RU)"
        ),
        "specializations": (
            "Anxiety & Panic Disorders\n"
            "Child & Adolescent Behavioral (ADHD, ODD & Impulse Control issues\n"
            "Depression & Mood Difficulties,Sleep Problem\n"
            "Trauma & Abuse Recovery\n"
            "Old Age Mental Health,Burnout & Caregiver Stress\n"
            "Adult Adjustment & Stress\n"
            "Relationship, Family Conflicts,Sexual Wellness & Intimacy Concerns\n"
            "Social Anxiety & Communication Skill\n"
            "Old Age Mental Health,Burnout & Caregiver Stress\n"
            "Positive Parenting"
        ),
        "interested_in": "",
        "phone": "",
        "active_in": "",
    },
    {
        "name": "Md. Nasim Billah",
        "qualifications": (
            "Associate Clinical Psychologist\n"
            "MS in Clinical Psychology (DU)\n"
            "BSc in Psychology (RU)"
        ),
        "specializations": (
            "OCD, Panic Disorder, Anxiety,\n"
            "Trauma & Crisis Support\n"
            "Depression, Mood Difficulties\n"
            "Sexual Wellness & Intimacy Concerns\n"
            "Relationship & Interpersonal Challenges\n"
            "Gender Identity issues\n"
            "Drug abuse & Addiction Management"
        ),
        "interested_in": "",
        "phone": "01719256963",
        "active_in": "",
    },
    {
        "name": "Mrs. Sadia Sharmin Urmi",
        "qualifications": (
            "Clinical psychologist\n"
            "M.Phil & MSc in Psychology (DU)\n"
            "EMDR ( Level -1) & DBT ( Level -1) Canada\n"
            "Drug Addiction Counselling ( Level -1) Canada"
        ),
        "specializations": (
            "CBT, DBT, Psychodrama, Treatment & Prevention of HIV/AIDS, ;Child & adolescent's assessment & treatment,\n"
            "Adult psychological problems & management\n"
            "Stress & anger management\n"
            "Crisis management, Suicidal risk assessment & treatment; Trauma (PTSD) assessment & treatment\n"
            "Drug addiction treatment\n"
            "Stroke patient's psychological problem's assessment and treatment\n"
            "Couple therapy, Family therapy\n"
            "Speech disorders of child & adult and treatment"
        ),
        "interested_in": "",
        "phone": "+1(306)2294462",
        "active_in": "Online",
    },
    {
        "name": "Mr.Mihir Sarker",
        "qualifications": (
            "M.Phil in Clinical Psychology (DU)\n"
            "MSc Clinical Psychology (DU)\n"
            "BSc & MSc in Psychology (DU)"
        ),
        "specializations": (
            "Depression Based Disorder (PDD, MDD)\n"
            "PTSD, CTSD, PSD (ED)\n"
            "Anxiety based(Health Anxiety, OCD, Panic Disorder, Exam Anxiety, Social Anxiety, FNSD, Agrophobia, (Others Phobia)\n"
            "Personality Disorders (BPD, Avoidant), Bipolar Mood Disorder\n"
            "Adult Relationship , Dicision Making"
        ),
        "interested_in": "",
        "phone": "",
        "active_in": "",
    },
    {
        "name": "Md. Mesbahul Islam",
        "qualifications": (
            "Clinical Psychologist, Shaheed Suhrawardy Medical College and Hospital, Dhaka\n"
            "Formar Clinical Psychologist, Pabna Mental Hospital,Pabna\n"
            "MSc and Mphil in Clinical Psychology\n"
            "BSc in Psychology"
        ),
        "specializations": (
            "CBT, DBT, NLP\n"
            "Suicide prevention, Eating Disorder\n"
            "Depression, Anxiety\n"
            "Adjustment Issue,\n"
            "Concentration problems\n"
            "Anger management, Stress management\n"
            "Trauma, Phobia, Panic Disorder"
        ),
        "interested_in": "",
        "phone": "01712255677",
        "active_in": "Online",
    },
    {
        "name": "Ms. Nazia Hossain Rupa",
        "qualifications": (
            "Assistant Counseling Psychologist\n"
            "MSc  in  Health Psychology (UK)\n"
            "MSc in Counseling psychology(DU)\n"
            "BSc in Psychology (DU)"
        ),
        "specializations": "",
        "interested_in": "",
        "phone": "",
        "active_in": "Online",
    },
    {
        "name": "Mrs. Saima Siddique",
        "qualifications": "MSc Clinical Psychology (DU)\nBSc in Psychology (NU)",
        "specializations": (
            "CBT, DBT, OCD\n"
            "Psychological Assessment\n"
            "Depression, Anxiety,Trauma\n"
            "Suicidal Risk Assessment\n"
            "Crisis Management"
        ),
        "interested_in": "",
        "phone": "01406654581",
        "active_in": "",
    },
    {
        "name": "Mrs. Tanjia Akhter",
        "qualifications": "",
        "specializations": "",
        "interested_in": "",
        "phone": "",
        "active_in": "",
    },
    {
        "name": "Tahia Tahreem",
        "qualifications": (
            "Bsc in Psychology(DU)\n"
            "MS in Psychology (DU)\n"
            "Ongoing Master's in Clinical and Counselling Psychology (JnU)\n"
            "Mental Health Consultant & Trainer\n"
            "CPH Trainee Forensic Psychologist\n"
            "CPH Founding Coordinator\n"
            "IFPLS Coordinator & General Education Dept.(ULAB)"
        ),
        "specializations": (
            "Mental Health Counseling\n"
            "Clinical and Counselling Psychology\n"
            "Forensic Psychology\n"
            "Psychological Training"
        ),
        "interested_in": "",
        "phone": "",
        "active_in": "",
    },
    {
        "name": "Kaniz Fatema",
        "qualifications": (
            "Clinical Psychologist & MHPSS Expert\n"
            "MSc & M.Phil  in Clinical Psychology (DU)\n"
            "BSc in Psychology (DU)"
        ),
        "specializations": (
            "Child  & Adult CBT Based Intervention\n"
            "Crisis Intervention &Psychological First Aid\n"
            "Trauma Informed & Mindfulness-Based Therapy\n"
            "Social Skills Development\n"
            "GBV & Protection\n"
            "Systematic Family Therapy\n"
            "mhGAP\n"
            "Staff Care & Quality of  Work Life"
        ),
        "interested_in": "",
        "phone": "01913130750",
        "active_in": "Online",
    },
    {
        "name": "Jannatul  Nayime",
        "qualifications": (
            "Assistant Counselling Psychologist\n"
            "BSc in Psychology, Chittagong College, Chattogram\n"
            "MS in Educational and Counselling Psychology, University of Dhaka\n"
            "Trained in Nonviolent Communication (NVC) and Transactional Analysis (TA), with a focus on creating a safe, empathetic, and supportive environment."
        ),
        "specializations": (
            "Relationship Issues\n"
            "Depression\n"
            "Obsessive-Compulsive Disorder (OCD)\n"
            "Phobias, Stress, and Trauma\n"
            "Anxiety Disorders"
        ),
        "interested_in": "",
        "phone": "01985289607",
        "active_in": "",
    },
    {
        "name": "Teresa Diana Gomes",
        "qualifications": (
            "Associate Counselling psychologist\n"
            "MS in Counselling Psychology (DU)\n"
            "BSc in Psychology (DU)"
        ),
        "specializations": (
            "CBT, DBT, NLP\n"
            "Suicide prevention, Eating Disorder\n"
            "Depression, Anxiety\n"
            "Adjustment Issue,\n"
            "Concentration problems\n"
            "Anger management, Stress management\n"
            "Trauma, Phobia, Panic Disorder"
        ),
        "interested_in": "",
        "phone": "01758253716",
        "active_in": "Saturday\nMonday\nWednesday",
    },
    {
        "name": "Tasnia Rahman Natasha",
        "qualifications": (
            "Associate Counseling Psychologist\n"
            "BSc in Psychology (GSTU)\n"
            "MS in Counseling Psychology (GSTU)\n"
            "PGT in Psychotherapy in Bangladesh (BMU)\n"
            "PGT in Forensic Psychology (IPH)\n"
            "Former Counseling Psychologist in Khulna (KMCH)\n"
            "Cognitive Behavioral Therapy (CBT), Psychological First Aid (PFA), Emotional and Behavioral Management"
        ),
        "specializations": (
            "Clinical assessment\n"
            "Depression, Anxiety Disorders\n"
            "Obsessive Compulsion Disorder (OCD)\n"
            "Behavioral Problem and Crisis Intervention\n"
            "Trauma and PTSD\n"
            "Stress and Anger Management\n"
            "Relationship and Family Conflict\n"
            "Coping Skills Development"
        ),
        "interested_in": "",
        "phone": "01768247485",
        "active_in": "",
    },
    {
        "name": "Mr. Mehedi hassan Aupu",
        "qualifications": (
            "Assistant Counselling Psychologist\n"
            "MS in Counselling Psychology (GSTU)\n"
            "BSc in Psychology (GSTU)"
        ),
        "specializations": (
            "CBT, DBT, REBT\n"
            "OCD, Social Anxiety\n"
            "PTSD, Trauma\n"
            "Stress and Anger Management\n"
            "Couple Counselling\n"
            "Depression, Anxiety\n"
            "Coping Skills Development"
        ),
        "interested_in": "",
        "phone": "0162935703",
        "active_in": "",
    },
    {
        "name": "Shakila Sultana Swati",
        "qualifications": (
            "Professional Psychologist\n"
            "Bsc in Psychology\n"
            "Msc in Psychology\n"
            "Training on CBT(06 months)"
        ),
        "specializations": (
            "Psychological Trainer\n"
            "Psychometric Assessment\n"
            "Counselling"
        ),
        "interested_in": "",
        "phone": "01799131029",
        "active_in": "",
    },
    {
        "name": "Nayima jannat Moni",
        "qualifications": (
            "Counseling Psychology\n"
            "BSc in Psychology\n"
            "MSc in Counseling Psychology"
        ),
        "specializations": "",
        "interested_in": "",
        "phone": "",
        "active_in": "",
    },
    {
        "name": "Chandrima Mourin",
        "qualifications": (
            "Psychologist\n"
            "MSc in Clinical Psychology (DU)\n"
            "BSc in Psychology  (DU)"
        ),
        "specializations": (
            "Depressive Disorder\n"
            "Anxiety Disorder\n"
            "Panic Disorder\n"
            "Cognitive behaviour therapy\n"
            "Non-Violent Communication (NVC)\n"
            "Mild to Severe Mental Disorder\n"
            "Personality Disorder\n"
            "Sexual Dysfunction\n"
            "OCD\n"
            "PTSD"
        ),
        "interested_in": "",
        "phone": "",
        "active_in": "",
    },
    {
        "name": "Saifun Nesa Zaman",
        "qualifications": (
            "Former Deputy Director(Counsellor),\n"
            "Student Counselling Guidence(DU).\n"
            "MSc and Mphil in Clinical Psychology (DU)\n"
            "BSc in Psychology (DU)"
        ),
        "specializations": (
            "CBT, DBT, NLP\n"
            "Suicide prevention, Eating Disorder\n"
            "Depression, Anxiety\n"
            "Adjustment Issue,\n"
            "Concentration problems\n"
            "Anger management, Stress management\n"
            "Trauma, Phobia, Panic Disorder"
        ),
        "interested_in": "",
        "phone": "",
        "active_in": "",
    },
    {
        "name": "Anjuman Ara (Eva)",
        "qualifications": (
            "Senior Psychologist\n"
            "MSc Clinical Psychology (DU)\n"
            "BSc in Psychology (DU)"
        ),
        "specializations": (
            "CBT, DBT, NLP\n"
            "Drug Addiction\n"
            "Depression, Anxiety\n"
            "Trauma, Phobia, Panic Disorder\n"
            "Migration Counselor"
        ),
        "interested_in": "",
        "phone": "",
        "active_in": "",
    },
    {
        "name": "Dr. Anjali Mishra",
        "qualifications": (
            "Dance Therapist\n"
            "PhD  in Dance\n"
            "BA & MA in Dance"
        ),
        "specializations": "",
        "interested_in": "",
        "phone": "",
        "active_in": "",
    },
    {
        "name": "Nazmun Shanta",
        "qualifications": (
            "Special Educator\n"
            "BSc & MSc in Psychology (DU)\n"
            "ARL (Alternative Route to Teaching) Licence on Special Education"
        ),
        "specializations": (
            "Individualized Education Program (IEP)\n"
            "Disabilities, Identification & Behavior Management"
        ),
        "interested_in": "",
        "phone": "",
        "active_in": "",
    },
    {
        "name": "Sayed Abrar",
        "qualifications": (
            "Assistant Director & Psychology Well-being Associate\n"
            "MA in Psychology & Education (UK)\n"
            "BSS Hon's ( DU)"
        ),
        "specializations": "",
        "interested_in": "",
        "phone": "",
        "active_in": "",
    },
]

DAY_ALIASES = {
    "saturday": ["saturday", "sat"],
    "sunday": ["sunday", "sun"],
    "monday": ["monday", "mon"],
    "tuesday": ["tuesday", "tue"],
    "wednesday": ["wednesday", "wed"],
    "thursday": ["thursday", "thu"],
    "friday": ["friday", "fri"],
}

TIME_RE = re.compile(r"(\d{1,2})(?:[.:](\d{2}))?\s*(am|pm)", re.IGNORECASE)


def _split_tags(text):
    tags = []
    for line in (text or "").splitlines():
        line = line.strip().strip(";").strip()
        if line:
            tags.append(line)
    return tags


def _make_slug(value, max_len=50):
    value = slugify(value) or "tag"
    if len(value) <= max_len:
        return value
    digest = hashlib.md5(value.encode()).hexdigest()[:8]
    return value[: max_len - 9] + "-" + digest


def _parse_availability(text):
    if not text:
        return []
    lowered = text.lower()
    session_type = "online" if "online" in lowered else "both"

    days = [
        day
        for day, aliases in DAY_ALIASES.items()
        if any(alias in lowered for alias in aliases)
    ]

    start = datetime.time(16, 0)
    match = TIME_RE.search(text)
    if match:
        hour = int(match.group(1))
        minute = int(match.group(2)) if match.group(2) else 0
        if match.group(3).lower() == "pm" and hour != 12:
            hour += 12
        elif match.group(3).lower() == "am" and hour == 12:
            hour = 0
        start = datetime.time(hour, minute)

    end_hour = min(start.hour + 2, 23)
    end = datetime.time(end_hour, start.minute)

    if days:
        return [(day, start, end, session_type) for day in days]
    if session_type == "online":
        return [("monday", datetime.time(10, 0), datetime.time(18, 0), "online")]
    return []


class Command(BaseCommand):
    help = "Seed the consultant list from the CPH roster sheet."

    def handle(self, *args, **options):
        created_users = 0
        created_consultants = 0
        skipped = 0
        created_tags = 0
        created_availability = 0
        warnings = []

        for entry in CONSULTANTS:
            name = entry["name"]
            slug = slugify(name) or "consultant"
            email = f"{slug}@cph.local"

            user, user_created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": email,
                    "full_name": name,
                    "phone_number": entry["phone"] or "",
                    "role": "consultant",
                },
            )
            if user_created:
                created_users += 1
            else:
                # Ensure an existing placeholder account is still a consultant.
                user.role = "consultant"
                user.full_name = name
                user.save(update_fields=["role", "full_name"])

            consultant, consultant_created = Consultant.objects.get_or_create(
                user=user,
                defaults={
                    "bio": entry["qualifications"].strip(),
                    "experience_years": 0,
                    "consultation_fee": 0,
                    "languages": "Bangla, English",
                    "location": "Dhaka",
                    "is_verified": True,
                    "is_available": True,
                },
            )
            if consultant_created:
                created_consultants += 1
            else:
                skipped += 1

            tags = _split_tags(entry["specializations"]) + _split_tags(
                entry["interested_in"]
            )
            for tag in tags:
                spec, created = Specialization.objects.get_or_create(
                    slug=_make_slug(tag),
                    defaults={"name": tag[:100]},
                )
                if created:
                    created_tags += 1
                consultant.specializations.add(spec)

            for day, start, end, session_type in _parse_availability(entry["active_in"]):
                ConsultantAvailability.objects.get_or_create(
                    consultant=consultant,
                    day=day,
                    defaults={
                        "start_time": start,
                        "end_time": end,
                        "session_type": session_type,
                    },
                )
                created_availability += 1

            if consultant_created:
                self.stdout.write(
                    self.style.SUCCESS(f"  + created: {name} <{email}>")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f"  - updated: {name} <{email}>")
                )

            if not entry["phone"]:
                warnings.append(f"no contact number: {name} <{email}>")
            if not tags:
                warnings.append(f"no specializations: {name} <{email}>")

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                f"Done. users created: {created_users}, "
                f"consultants created: {created_consultants}, "
                f"skipped: {skipped}, "
                f"tags created: {created_tags}, "
                f"availability rows: {created_availability}"
            )
        )
        if warnings:
            self.stdout.write(self.style.WARNING("Warnings:"))
            for w in warnings:
                self.stdout.write(self.style.WARNING(f"  - {w}"))
