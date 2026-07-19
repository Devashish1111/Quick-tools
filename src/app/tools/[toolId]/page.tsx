import { tools } from '@/tools/toolsConfig';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { ToolErrorBoundary } from '@/components/ToolErrorBoundary';

const directComponents: Record<string, React.ComponentType> = {
  'url-shortener': dynamic(() => import('@/tools/UrlShortener')),
  'qr-code': dynamic(() => import('@/tools/QrCodeGenerator')),
  'password-generator': dynamic(() => import('@/tools/PasswordGenerator')),
  'case-converter': dynamic(() => import('@/tools/CaseConverter')),
  'word-counter': dynamic(() => import('@/tools/WordCounter')),
  'lorem-ipsum': dynamic(() => import('@/tools/LoremIpsum')),
  'text-slug': dynamic(() => import('@/tools/TextToSlug')),
  'base64': dynamic(() => import('@/tools/Base64Tool')),
  'json-formatter': dynamic(() => import('@/tools/JsonFormatter')),
  'uuid-generator': dynamic(() => import('@/tools/UuidGenerator')),
  'timestamp-converter': dynamic(() => import('@/tools/TimestampConverter')),
  'hash-generator': dynamic(() => import('@/tools/HashGenerator')),
  'percentage-calculator': dynamic(() => import('@/tools/PercentageCalculator')),
  'random-number': dynamic(() => import('@/tools/RandomNumber')),
  'age-calculator': dynamic(() => import('@/tools/AgeCalculator')),
  'bmi-calculator': dynamic(() => import('@/tools/BmiCalculator')),
  'unit-converter': dynamic(() => import('@/tools/UnitConverter')),
  'color-converter': dynamic(() => import('@/tools/ColorConverter')),
  'image-to-base64': dynamic(() => import('@/tools/ImageToBase64')),
  'markdown-preview': dynamic(() => import('@/tools/MarkdownPreview')),
  'css-gradient': dynamic(() => import('@/tools/CssGradientGenerator')),
  'regex-tester': dynamic(() => import('@/tools/RegexTester')),
  'ip-info': dynamic(() => import('@/tools/IpInfoLookup')),
  'pomodoro': dynamic(() => import('@/tools/PomodoroTimer')),
};

export async function generateMetadata({ params }: { params: Promise<{ toolId: string }> }): Promise<Metadata> {
  const { toolId } = await params;
  const activeTool = tools.find((t) => t.id === toolId);
  if (!activeTool) return {};
  
  return {
    title: `${activeTool.name} — Free Online Tool | KwikToolbox`,
    description: `${activeTool.description} Free, instant, no signup. Works entirely in your browser.`,
    alternates: {
      canonical: `/tools/${toolId}`,
    },
    openGraph: {
      title: `${activeTool.name} — KwikToolbox`,
      description: activeTool.description,
      url: `/tools/${toolId}`,
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return tools.map((tool) => ({
    toolId: tool.id,
  }));
}

export default async function ToolPage({ params }: { params: Promise<{ toolId: string }> }) {
  const { toolId } = await params;
  const ActiveComponent = directComponents[toolId];
  const activeTool = tools.find((t) => t.id === toolId);
  
  if (!ActiveComponent || !activeTool) {
    notFound();
  }

  const toolJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': activeTool.name,
    'url': `https://kwiktoolbox.com/tools/${toolId}`,
    'description': activeTool.description,
    'applicationCategory': 'UtilitiesApplication',
    'operatingSystem': 'Web',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />
      <ToolErrorBoundary>
        <ActiveComponent />
      </ToolErrorBoundary>
    </>
  );
}

