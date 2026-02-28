import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Map,
  Sparkles,
  ClipboardCheck,
  Database,
  Brain,
  Globe2,
  Gift,
  MapPin,
  BarChart3,
  Lightbulb,
  Search,
} from 'lucide-react';

export default function LandingPage() {
  const t = useTranslations('landing');
  const tCommon = useTranslations('common');

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              상
            </div>
            <span className="font-bold">{tCommon('appName')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                {tCommon('login')}
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">{tCommon('signup')}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl whitespace-pre-line">
              {t('heroTitle')}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg whitespace-pre-line">
              {t('heroSubtitle')}
            </p>

            {/* Search Bar */}
            <div className="mx-auto mt-8 flex max-w-md items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder={t('searchPlaceholder')}
                  readOnly
                />
              </div>
              <Link href="/explore">
                <Button>{t('startAnalysis')}</Button>
              </Link>
            </div>

            {/* Quick Action Cards - horizontal scroll on mobile */}
            <div className="mt-8 flex gap-3 overflow-x-auto pb-2 sm:justify-center">
              {[
                {
                  icon: Map,
                  title: t('quickAction1Title'),
                  desc: t('quickAction1Desc'),
                  href: '/explore',
                },
                {
                  icon: Sparkles,
                  title: t('quickAction2Title'),
                  desc: t('quickAction2Desc'),
                  href: '/recommend',
                },
                {
                  icon: ClipboardCheck,
                  title: t('quickAction3Title'),
                  desc: t('quickAction3Desc'),
                  href: '/feasibility',
                },
              ].map((card) => (
                <Link key={card.href} href={card.href} className="min-w-[200px] sm:min-w-0 sm:flex-1">
                  <Card className="h-full transition-colors hover:bg-muted/50">
                    <CardHeader className="p-4">
                      <card.icon className="h-6 w-6 text-primary" />
                      <CardTitle className="text-sm">{card.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {card.desc}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            {t('featuresTitle')}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: Database, title: t('feature1Title'), desc: t('feature1Desc') },
              { icon: Brain, title: t('feature2Title'), desc: t('feature2Desc') },
              { icon: Globe2, title: t('feature3Title'), desc: t('feature3Desc') },
              { icon: Gift, title: t('feature4Title'), desc: t('feature4Desc') },
            ].map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {feature.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-b bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            {t('howItWorksTitle')}
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              { icon: MapPin, step: '01', title: t('step1Title'), desc: t('step1Desc') },
              { icon: BarChart3, step: '02', title: t('step2Title'), desc: t('step2Desc') },
              { icon: Lightbulb, step: '03', title: t('step3Title'), desc: t('step3Desc') },
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="mt-2 text-xs font-bold text-primary">
                  STEP {step.step}
                </div>
                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">{t('ctaTitle')}</h2>
          <p className="mt-3 text-muted-foreground">{t('ctaSubtitle')}</p>
          <Link href="/signup">
            <Button size="lg" className="mt-6">
              {t('ctaButton')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-6 text-center text-xs text-muted-foreground">
        <p>{tCommon('copyright')}</p>
        <p className="mt-1">{tCommon('disclaimer')}</p>
      </footer>
    </div>
  );
}
