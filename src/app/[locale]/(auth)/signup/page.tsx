import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SignupForm } from '@/components/auth/SignupForm';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { Link } from '@/i18n/navigation';

export default function SignupPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
          상
        </div>
        <CardTitle className="text-xl">{t('signupTitle')}</CardTitle>
        <CardDescription>{t('signupSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignupForm />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              {t('orContinueWith')}
            </span>
          </div>
        </div>
        <SocialLoginButtons />
        <p className="text-center text-sm text-muted-foreground">
          {t('hasAccount')}{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            {tCommon('login')}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
