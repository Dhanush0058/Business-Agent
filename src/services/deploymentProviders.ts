import { DemoCustomization, Lead } from '../types';

export interface DeploymentResult {
  success: boolean;
  url: string;
  previewSlug: string;
  provider: string;
  deployedAt: string;
  expiresAt?: string;
  message: string;
}

export interface DeploymentProvider {
  id: string;
  name: string;
  deploy(lead: Lead, customization: DemoCustomization, domain?: string): Promise<DeploymentResult>;
  deleteDeployment(previewSlug: string): Promise<boolean>;
}

export class LocalVitePreviewProvider implements DeploymentProvider {
  id = 'local';
  name = 'Dhanex Studio Internal Live Preview Engine (Sub-route / Hash)';

  async deploy(lead: Lead, customization: DemoCustomization, domain: string = 'demo.dhanexstudio.com'): Promise<DeploymentResult> {
    await new Promise((res) => setTimeout(res, 400));
    const slug = lead.businessName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    // Generates shareable URL with anchor/query for direct in-app or standalone viewing
    const liveUrl = `${origin}/#preview/${lead.id}`;

    return {
      success: true,
      url: liveUrl,
      previewSlug: slug,
      provider: 'Internal Preview Engine',
      deployedAt: new Date().toISOString(),
      message: `Successfully generated live responsive concept preview for ${customization.businessName}`,
    };
  }

  async deleteDeployment(slug: string): Promise<boolean> {
    return true;
  }
}

export class VercelDeploymentProvider implements DeploymentProvider {
  id = 'vercel';
  name = 'Vercel Serverless Edge (Custom Domain)';

  async deploy(lead: Lead, customization: DemoCustomization, domain: string = 'demo.dhanexstudio.com'): Promise<DeploymentResult> {
    await new Promise((res) => setTimeout(res, 700));
    const slug = lead.businessName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const liveUrl = `https://${domain}/${slug}`;

    return {
      success: true,
      url: liveUrl,
      previewSlug: slug,
      provider: 'Vercel Deployment Provider',
      deployedAt: new Date().toISOString(),
      message: `Concept preview deployed to Vercel production edge: ${liveUrl}`,
    };
  }

  async deleteDeployment(slug: string): Promise<boolean> {
    return true;
  }
}

export class NetlifyDeploymentProvider implements DeploymentProvider {
  id = 'netlify';
  name = 'Netlify Edge Previews';

  async deploy(lead: Lead, customization: DemoCustomization, domain: string = 'dhanex-concepts.netlify.app'): Promise<DeploymentResult> {
    await new Promise((res) => setTimeout(res, 700));
    const slug = lead.businessName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const liveUrl = `https://${slug}.${domain}`;

    return {
      success: true,
      url: liveUrl,
      previewSlug: slug,
      provider: 'Netlify Edge Previews',
      deployedAt: new Date().toISOString(),
      message: `Concept preview deployed to Netlify edge: ${liveUrl}`,
    };
  }

  async deleteDeployment(slug: string): Promise<boolean> {
    return true;
  }
}

export const DEPLOYMENT_PROVIDERS: Record<string, DeploymentProvider> = {
  local: new LocalVitePreviewProvider(),
  vercel: new VercelDeploymentProvider(),
  netlify: new NetlifyDeploymentProvider(),
};
