import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

type SendEmailParams = {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY não configurada. Email não enviado.')
    return
  }

  const from = process.env.EMAIL_FROM || 'Chá e Encantos <onboarding@resend.dev>'

  return resend.emails.send({
    from,
    to,
    subject,
    html
  })
}