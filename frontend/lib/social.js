import {
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
} from 'react-icons/fi'

export const SOCIAL_LINKS = [
  {
    icon: FiFacebook,
    href: 'https://www.facebook.com/CPHBD',
    label: 'Facebook',
  },
  {
    icon: FiInstagram,
    href: 'https://www.instagram.com/cfphbd',
    label: 'Instagram',
  },
  {
    icon: FiLinkedin,
    href: 'https://www.linkedin.com/company/centreforpsychologicalhealth/',
    label: 'LinkedIn',
  },
  {
    icon: FiYoutube,
    href: 'https://www.youtube.com/@cfphuk',
    label: 'YouTube',
  },
]

export const SOCIAL_URLS = Object.fromEntries(
  SOCIAL_LINKS.map(({ href, label }) => [label.toLowerCase(), href])
)
