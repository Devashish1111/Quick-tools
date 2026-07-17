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
    title: `${activeTool.name} — QuickToolbox Free Online Tool`,
    description: activeTool.description,
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
  
  if (!ActiveComponent) {
    notFound();
  }

  return (
    <ToolErrorBoundary>
      <ActiveComponent />
    </ToolErrorBoundary>
  );
}
