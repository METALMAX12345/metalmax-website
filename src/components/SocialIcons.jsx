export function TelegramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M21.5 3.5 2.7 10.8c-1.1.4-1.1 1.7 0 2.1l4.6 1.5 1.8 5.6c.3.9 1.4 1.1 2 .4l2.6-2.8 4.7 3.5c.9.7 2.2.2 2.4-.9L23 4.9c.2-1.1-.9-2-1.5-1.4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.6 15.1 18 7.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  )
}

export function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M14 21v-8h2.7l.4-3.1H14V8c0-.9.3-1.5 1.6-1.5H17V3.6C16.7 3.5 15.8 3.4 14.7 3.4c-2.2 0-3.7 1.3-3.7 3.8v2.7H8.3V13H11v8h3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" />
    </svg>
  )
}

export function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7.5" cy="8" r="1.2" fill="currentColor" />
      <path d="M7.5 11v6M11.5 11v6M11.5 13.5c0-1.4 1-2.5 2.4-2.5s2.1 1 2.1 2.5V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export const SOCIAL_ICONS = {
  telegram: TelegramIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
  linkedin: LinkedinIcon,
}