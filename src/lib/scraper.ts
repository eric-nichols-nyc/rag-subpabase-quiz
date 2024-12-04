import * as cheerio from 'cheerio';

export async function scrapeUrl(url: string) {
    try {
      // Validate URL
      const validUrl = new URL(url);
      
      // Add user-agent to avoid being blocked by some websites
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('text/html')) {
        throw new Error('URL does not point to an HTML page');
      }

      const html = await response.text();
      if (!html) {
        throw new Error('No content received from URL');
      }

      const $ = cheerio.load(html);
      
      // Remove unwanted elements
      $('script, style, noscript, iframe, img, svg, [style*="display:none"]').remove();
      
      // Get the title (with fallbacks)
      let title = $('meta[property="og:title"]').attr('content') || 
                 $('title').text() || 
                 $('h1').first().text() || 
                 validUrl.hostname;
                 
      title = title.trim();
      
      // Try to get the main content using common selectors
      const mainSelectors = [
        'main',
        'article',
        '[role="main"]',
        '#main-content',
        '.main-content',
        '.post-content',
        '.article-content',
        '.content',
        '#content'
      ];

      let content = '';
      
      // Try each selector until we find content
      for (const selector of mainSelectors) {
        const element = $(selector).first();
        if (element.length) {
          content = element.text();
          break;
        }
      }

      // Fallback to body if no content found
      if (!content) {
        content = $('body').text();
      }

      // Clean up the content
      const cleanContent = content
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim();

      if (!cleanContent) {
        throw new Error('No readable content found on the page');
      }

      return {
        title,
        content: cleanContent,
        url: validUrl.toString()
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Scraping failed: ${error.message}`);
      }
      throw new Error('An unknown error occurred while scraping the URL');
    }
}