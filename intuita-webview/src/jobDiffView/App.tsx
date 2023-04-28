import { useCallback, useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import {
	View,
	WebviewMessage,
	JobDiffViewProps,
	JobAction,
} from '../shared/types';
import { JobDiffViewContainer } from './DiffViewer/index';
import './index.css';
// import { JobHash } from '../../../src/jobs/types';

// const viewMock: View = {
// 	"viewId": "jobDiffView",
// 	"viewProps": {
// 			"title": "next/13/new-link",
// 			"data": [
// 					{
// 							"jobHash": "R-l1NFheOBPwojspg_V9Iy4cGOY" as JobHash,
// 							"jobKind": 1,
// 							"oldFileTitle": null,
// 							"newFileTitle": "/components/dev-dot-opt-in/standalone-link/index.tsx",
// 							"oldFileContent": "import { ReactElement } from 'react'\nimport Link from 'next/link'\nimport classNames from 'classnames'\nimport { StandaloneLinkProps } from './types'\nimport s from './standalone-link.module.css'\n/* Copied from devdot https://github.com/hashicorp/dev-portal/tree/main/src/components/standalone-link */\nconst StandaloneLink = ({\n  ariaLabel,\n  className,\n  color = 'primary',\n  download,\n  href,\n  icon,\n  iconPosition,\n  onClick,\n  openInNewTab = false,\n  size = 'medium',\n  text,\n  textClassName,\n}: StandaloneLinkProps): ReactElement => {\n  const classes = classNames(s.root, s[`color-${color}`], s[size], className)\n  const rel = openInNewTab ? 'noreferrer noopener' : undefined\n  const target = openInNewTab ? '_blank' : '_self'\n  return (\n    <Link href={href}>\n      {/**\n       * NOTE: this markup is valid. It's OK to have an `onClick` when there is\n       * also an `href` present. The `jsx-a11y/anchor-is-valid` rule is not\n       * seeing this though since the `href` attribute is being set on `Link`\n       * rather than the `<a>`.\n       */}\n      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}\n      <a\n        aria-label={ariaLabel}\n        className={classes}\n        download={download}\n        onClick={onClick}\n        rel={rel}\n        target={target}\n      >\n        {iconPosition === 'leading' && icon}\n        <span className={classNames(s.text, textClassName)}>{text}</span>\n        {iconPosition === 'trailing' && icon}\n      </a>\n    </Link>\n  )\n}\nexport type { StandaloneLinkProps }\nexport default StandaloneLink\n",
// 							"newFileContent": "import { ReactElement } from 'react'\nimport Link from 'next/link'\nimport classNames from 'classnames'\nimport { StandaloneLinkProps } from './types'\nimport s from './standalone-link.module.css'\n/* Copied from devdot https://github.com/hashicorp/dev-portal/tree/main/src/components/standalone-link */\nconst StandaloneLink = ({\n  ariaLabel,\n  className,\n  color = 'primary',\n  download,\n  href,\n  icon,\n  iconPosition,\n  onClick,\n  openInNewTab = false,\n  size = 'medium',\n  text,\n  textClassName,\n}: StandaloneLinkProps): ReactElement => {\n  const classes = classNames(s.root, s[`color-${color}`], s[size], className)\n  const rel = openInNewTab ? 'noreferrer noopener' : undefined\n  const target = openInNewTab ? '_blank' : '_self'\n  return (\n    <Link\n      href={href}\n      aria-label={ariaLabel}\n      className={classes}\n      download={download}\n      onClick={onClick}\n      rel={rel}\n      target={target}\n    >\n      {/**\n       * NOTE: this markup is valid. It's OK to have an `onClick` when there is\n       * also an `href` present. The `jsx-a11y/anchor-is-valid` rule is not\n       * seeing this though since the `href` attribute is being set on `Link`\n       * rather than the `<a>`.\n       */}\n      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}\n\n      {iconPosition === 'leading' && icon}\n      <span className={classNames(s.text, textClassName)}>{text}</span>\n      {iconPosition === 'trailing' && icon}\n    </Link>\n  )\n}\nexport type { StandaloneLinkProps }\nexport default StandaloneLink\n",
// 							"title": "Rewrite",
// 							"actions": []
// 					},
// 					{
// 							"jobHash": "H1SHyuRDy6xK23j-n5JlkpzuqIU" as JobHash,
// 							"jobKind": 1,
// 							"oldFileTitle": null,
// 							"newFileTitle": "/components/dev-dot-opt-in/button-link/index.tsx",
// 							"oldFileContent": "import Link from 'next/link'\nimport classNames from 'classnames'\nimport { ButtonLinkProps } from './types'\nimport s from './button-link.module.css'\n/**\n * _Note WIP Component_\n * this button link component should mimic the design system options\n * outlined in `Button` component. This is a WIP implementation and should be\n * expanded upon. It currently renders a theme colors and sizes, with styles\n * copied from `Button`.\n **/\nconst ButtonLink = ({\n  'aria-label': ariaLabel,\n  color = 'primary',\n  href,\n  icon,\n  iconPosition = 'leading',\n  openInNewTab = false,\n  size = 'medium',\n  text,\n  className,\n  onClick,\n}: ButtonLinkProps) => {\n  const hasIcon = !!icon\n  const hasText = !!text\n  const hasLabel = !!ariaLabel\n  const hasLeadingIcon = hasIcon && iconPosition === 'leading'\n  const hasTrailingIcon = hasIcon && iconPosition === 'trailing'\n  const isIconOnly = hasIcon && !hasText\n  if (!hasIcon && !hasText) {\n    throw new Error(\n      '`ButtonLink` must have either `text` or an `icon` with accessible labels.'\n    )\n  }\n  if (isIconOnly && !hasLabel) {\n    throw new Error(\n      'Icon-only `ButtonLink`s require an accessible label. Either provide the `text` prop, or `ariaLabel`.'\n    )\n  }\n  return (\n    <Link href={href}>\n      {/**\n       * copied from components/standalone-link\n       * NOTE: this markup is valid. It's OK to have an `onClick` when there is\n       * also an `href` present. The `jsx-a11y/anchor-is-valid` rule is not\n       * seeing this though since the `href` attribute is being set on `Link`\n       * rather than the `<a>`.\n       */}\n      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}\n      <a\n        aria-label={ariaLabel}\n        className={classNames(s.root, s[size], s[color], className)}\n        rel={openInNewTab ? 'noreferrer noopener' : undefined}\n        target={openInNewTab ? '_blank' : '_self'}\n        onClick={onClick}\n      >\n        {hasLeadingIcon && icon}\n        {hasText ? text : null}\n        {hasTrailingIcon && icon}\n      </a>\n    </Link>\n  )\n}\nexport default ButtonLink\n",
// 							"newFileContent": "import Link from 'next/link'\nimport classNames from 'classnames'\nimport { ButtonLinkProps } from './types'\nimport s from './button-link.module.css'\n/**\n * _Note WIP Component_\n * this button link component should mimic the design system options\n * outlined in `Button` component. This is a WIP implementation and should be\n * expanded upon. It currently renders a theme colors and sizes, with styles\n * copied from `Button`.\n **/\nconst ButtonLink = ({\n  'aria-label': ariaLabel,\n  color = 'primary',\n  href,\n  icon,\n  iconPosition = 'leading',\n  openInNewTab = false,\n  size = 'medium',\n  text,\n  className,\n  onClick,\n}: ButtonLinkProps) => {\n  const hasIcon = !!icon\n  const hasText = !!text\n  const hasLabel = !!ariaLabel\n  const hasLeadingIcon = hasIcon && iconPosition === 'leading'\n  const hasTrailingIcon = hasIcon && iconPosition === 'trailing'\n  const isIconOnly = hasIcon && !hasText\n  if (!hasIcon && !hasText) {\n    throw new Error(\n      '`ButtonLink` must have either `text` or an `icon` with accessible labels.'\n    )\n  }\n  if (isIconOnly && !hasLabel) {\n    throw new Error(\n      'Icon-only `ButtonLink`s require an accessible label. Either provide the `text` prop, or `ariaLabel`.'\n    )\n  }\n  return (\n    <Link\n      href={href}\n      aria-label={ariaLabel}\n      className={classNames(s.root, s[size], s[color], className)}\n      rel={openInNewTab ? 'noreferrer noopener' : undefined}\n      target={openInNewTab ? '_blank' : '_self'}\n      onClick={onClick}\n    >\n      {/**\n       * copied from components/standalone-link\n       * NOTE: this markup is valid. It's OK to have an `onClick` when there is\n       * also an `href` present. The `jsx-a11y/anchor-is-valid` rule is not\n       * seeing this though since the `href` attribute is being set on `Link`\n       * rather than the `<a>`.\n       */}\n      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}\n\n      {hasLeadingIcon && icon}\n      {hasText ? text : null}\n      {hasTrailingIcon && icon}\n    </Link>\n  )\n}\nexport default ButtonLink\n",
// 							"title": "Rewrite",
// 							"actions": []
// 					},
// 					{
// 							"jobHash": "HlEyNftfHPSeX2QGPhDRsOCy-6k" as JobHash,
// 							"jobKind": 1,
// 							"oldFileTitle": null,
// 							"newFileTitle": "/components/nav-back/index.jsx",
// 							"oldFileContent": "import Link from 'next/link'\nimport styles from './NavBack.module.css'\nimport ArrowLeft from './images/arrow-left.svg'\nexport default function NavBack({ text, url }) {\n  return (\n    <Link href={url}>\n      <a className={styles.navBack}>\n        <img src={ArrowLeft} />\n        {text}\n      </a>\n    </Link>\n  )\n}\n",
// 							"newFileContent": "import Link from 'next/link'\nimport styles from './NavBack.module.css'\nimport ArrowLeft from './images/arrow-left.svg'\nexport default function NavBack({ text, url }) {\n  return (\n    <Link href={url} className={styles.navBack}>\n      <img src={ArrowLeft} />\n      {text}\n    </Link>\n  )\n}\n",
// 							"title": "Rewrite",
// 							"actions": []
// 					},
// 					{
// 							"jobHash": "2EFZthjgpQH-fje5LElnuY9gS08" as JobHash,
// 							"jobKind": 1,
// 							"oldFileTitle": null,
// 							"newFileTitle": "/components/io-home-feature/index.tsx",
// 							"oldFileContent": "import * as React from 'react'\nimport Image from 'next/image'\nimport Link from 'next/link'\nimport { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'\nimport s from './style.module.css'\nexport interface IoHomeFeatureProps {\n  isInternalLink: (link: string) => boolean;\n  link?: string;\n  image: {\n    url: string,\n    alt: string,\n  };\n  heading: string;\n  description: string;\n}\nexport default function IoHomeFeature({\n  isInternalLink,\n  link,\n  image,\n  heading,\n  description,\n}: IoHomeFeatureProps): React.ReactElement {\n  return (\n    <IoHomeFeatureWrap isInternalLink={isInternalLink} href={link}>\n      <div className={s.featureMedia}>\n        <Image\n          src={image.url}\n          width={400}\n          height={200}\n          layout=\"responsive\"\n          alt={image.alt}\n        />\n      </div>\n      <div className={s.featureContent}>\n        <h3 className={s.featureHeading}>{heading}</h3>\n        <p className={s.featureDescription}>{description}</p>\n        {link ? (\n          <span className={s.featureCta} aria-hidden={true}>\n            Learn more{' '}\n            <span>\n              <IconArrowRight16 />\n            </span>\n          </span>\n        ) : null}\n      </div>\n    </IoHomeFeatureWrap>\n  )\n}\ninterface IoHomeFeatureWrapProps {\n  isInternalLink: (link: string) => boolean;\n  href: string;\n  children: React.ReactNode;\n}\nfunction IoHomeFeatureWrap({\n  isInternalLink,\n  href,\n  children,\n}: IoHomeFeatureWrapProps) {\n  if (!href) {\n    return <div className={s.feature}>{children}</div>\n  }\n  if (isInternalLink(href)) {\n    return (\n      <Link href={href}>\n        <a className={s.feature}>{children}</a>\n      </Link>\n    )\n  }\n  return (\n    <a className={s.feature} href={href}>\n      {children}\n    </a>\n  )\n}\n",
// 							"newFileContent": "import * as React from 'react'\nimport Image from 'next/image'\nimport Link from 'next/link'\nimport { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'\nimport s from './style.module.css'\nexport interface IoHomeFeatureProps {\n  isInternalLink: (link: string) => boolean;\n  link?: string;\n  image: {\n    url: string,\n    alt: string,\n  };\n  heading: string;\n  description: string;\n}\nexport default function IoHomeFeature({\n  isInternalLink,\n  link,\n  image,\n  heading,\n  description,\n}: IoHomeFeatureProps): React.ReactElement {\n  return (\n    <IoHomeFeatureWrap isInternalLink={isInternalLink} href={link}>\n      <div className={s.featureMedia}>\n        <Image\n          src={image.url}\n          width={400}\n          height={200}\n          layout=\"responsive\"\n          alt={image.alt}\n        />\n      </div>\n      <div className={s.featureContent}>\n        <h3 className={s.featureHeading}>{heading}</h3>\n        <p className={s.featureDescription}>{description}</p>\n        {link ? (\n          <span className={s.featureCta} aria-hidden={true}>\n            Learn more{' '}\n            <span>\n              <IconArrowRight16 />\n            </span>\n          </span>\n        ) : null}\n      </div>\n    </IoHomeFeatureWrap>\n  )\n}\ninterface IoHomeFeatureWrapProps {\n  isInternalLink: (link: string) => boolean;\n  href: string;\n  children: React.ReactNode;\n}\nfunction IoHomeFeatureWrap({\n  isInternalLink,\n  href,\n  children,\n}: IoHomeFeatureWrapProps) {\n  if (!href) {\n    return <div className={s.feature}>{children}</div>\n  }\n  if (isInternalLink(href)) {\n    return (\n      <Link href={href} className={s.feature}>\n        {children}\n      </Link>\n    )\n  }\n  return (\n    <a className={s.feature} href={href}>\n      {children}\n    </a>\n  )\n}\n",
// 							"title": "Rewrite",
// 							"actions": []
// 					},
// 					{
// 							"jobHash": "4I_4Us8Z5A6ifuz5O8jhK7dSM0A" as JobHash,
// 							"jobKind": 1,
// 							"oldFileTitle": null,
// 							"newFileTitle": "/components/io-card/index.tsx",
// 							"oldFileContent": "import * as React from 'react';\nimport Link from 'next/link';\nimport InlineSvg from '@hashicorp/react-inline-svg';\nimport classNames from 'classnames';\nimport { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24';\nimport { IconExternalLink24 } from '@hashicorp/flight-icons/svg-react/external-link-24';\nimport { productLogos } from './product-logos';\nimport s from './style.module.css';\nexport interface IoCardProps {\n    variant?: 'light' | 'gray' | 'dark';\n    products?: Array<{\n        name: keyof typeof productLogos;\n    }>;\n    link: {\n        url: string;\n        type: 'inbound' | 'outbound';\n    };\n    inset?: 'none' | 'sm' | 'md';\n    eyebrow?: string;\n    heading?: string;\n    description?: string;\n    children?: React.ReactNode;\n}\nfunction IoCard({ variant = 'light', products, link, inset = 'md', eyebrow, heading, description, children, }: IoCardProps): React.ReactElement {\n    const LinkWrapper = ({ className, children }) => link.type === 'inbound' ? (<Link href={link.url}>\n        <a className={className}>{children}</a>\n      </Link>) : (<a className={className} href={link.url} target=\"_blank\" rel=\"noopener noreferrer\">\n        {children}\n      </a>);\n    return (<article className={classNames(s.card)}>\n      <LinkWrapper className={classNames(s[variant], s[inset])}>\n        {children ? (children) : (<>\n            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}\n            {heading ? <Heading>{heading}</Heading> : null}\n            {description ? <Description>{description}</Description> : null}\n          </>)}\n        <footer className={s.footer}>\n          {products && (<ul className={s.products}>\n              {products.map(({ name }, index) => {\n                const key = name.toLowerCase();\n                const version = variant === 'dark' ? 'neutral' : 'color';\n                return (\n                // eslint-disable-next-line react/no-array-index-key\n                <li key={index}>\n                    <InlineSvg className={s.logo} src={productLogos[key][version]}/>\n                  </li>);\n            })}\n            </ul>)}\n          <span className={s.linkType}>\n            {link.type === 'inbound' ? (<IconArrowRight24 />) : (<IconExternalLink24 />)}\n          </span>\n        </footer>\n      </LinkWrapper>\n    </article>);\n}\ninterface EyebrowProps {\n    children: string;\n}\nfunction Eyebrow({ children }: EyebrowProps) {\n    return <p className={s.eyebrow}>{children}</p>;\n}\ninterface HeadingProps {\n    as?: 'h2' | 'h3' | 'h4';\n    children: React.ReactNode;\n}\nfunction Heading({ as: Component = 'h2', children }: HeadingProps) {\n    return <Component className={s.heading}>{children}</Component>;\n}\ninterface DescriptionProps {\n    children: string;\n}\nfunction Description({ children }: DescriptionProps) {\n    return <p className={s.description}>{children}</p>;\n}\nIoCard.Eyebrow = Eyebrow;\nIoCard.Heading = Heading;\nIoCard.Description = Description;\nexport default IoCard;\n",
// 							"newFileContent": "import * as React from 'react';\nimport Link from 'next/link';\nimport InlineSvg from '@hashicorp/react-inline-svg';\nimport classNames from 'classnames';\nimport { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24';\nimport { IconExternalLink24 } from '@hashicorp/flight-icons/svg-react/external-link-24';\nimport { productLogos } from './product-logos';\nimport s from './style.module.css';\nexport interface IoCardProps {\n    variant?: 'light' | 'gray' | 'dark';\n    products?: Array<{\n        name: keyof typeof productLogos;\n    }>;\n    link: {\n        url: string;\n        type: 'inbound' | 'outbound';\n    };\n    inset?: 'none' | 'sm' | 'md';\n    eyebrow?: string;\n    heading?: string;\n    description?: string;\n    children?: React.ReactNode;\n}\nfunction IoCard({ variant = 'light', products, link, inset = 'md', eyebrow, heading, description, children, }: IoCardProps): React.ReactElement {\n    const LinkWrapper = ({ className, children }) => link.type === 'inbound' ? (<Link href={link.url} className={className}>\n        {children}\n      </Link>) : (<a className={className} href={link.url} target=\"_blank\" rel=\"noopener noreferrer\">\n        {children}\n      </a>);\n    return (\n        (<article className={classNames(s.card)}>\n            <LinkWrapper className={classNames(s[variant], s[inset])}>\n              {children ? (children) : (<>\n                  {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}\n                  {heading ? <Heading>{heading}</Heading> : null}\n                  {description ? <Description>{description}</Description> : null}\n                </>)}\n              <footer className={s.footer}>\n                {products && (<ul className={s.products}>\n                    {products.map(({ name }, index) => {\n                      const key = name.toLowerCase();\n                      const version = variant === 'dark' ? 'neutral' : 'color';\n                      return (\n                          // eslint-disable-next-line react/no-array-index-key\n                          (<li key={index}>\n                              <InlineSvg className={s.logo} src={productLogos[key][version]}/>\n                          </li>)\n                      );\n                  })}\n                  </ul>)}\n                <span className={s.linkType}>\n                  {link.type === 'inbound' ? (<IconArrowRight24 />) : (<IconExternalLink24 />)}\n                </span>\n              </footer>\n            </LinkWrapper>\n        </article>)\n    );\n}\ninterface EyebrowProps {\n    children: string;\n}\nfunction Eyebrow({ children }: EyebrowProps) {\n    return <p className={s.eyebrow}>{children}</p>;\n}\ninterface HeadingProps {\n    as?: 'h2' | 'h3' | 'h4';\n    children: React.ReactNode;\n}\nfunction Heading({ as: Component = 'h2', children }: HeadingProps) {\n    return <Component className={s.heading}>{children}</Component>;\n}\ninterface DescriptionProps {\n    children: string;\n}\nfunction Description({ children }: DescriptionProps) {\n    return <p className={s.description}>{children}</p>;\n}\nIoCard.Eyebrow = Eyebrow;\nIoCard.Heading = Heading;\nIoCard.Description = Description;\nexport default IoCard;\n",
// 							"title": "Rewrite",
// 							"actions": []
// 					},
// 					{
// 							"jobHash": "uyHVrG_nQY_x1Zeh_-tBJo3J5KQ" as JobHash,
// 							"jobKind": 1,
// 							"oldFileTitle": null,
// 							"newFileTitle": "/components/footer/index.jsx",
// 							"oldFileContent": "import s from './style.module.css'\nimport Link from 'next/link'\nexport default function Footer({ openConsentManager }) {\n  return (\n    <footer className={s.footer}>\n      <div className=\"g-grid-container\">\n        <ul className={`${s.footerLinks} ${s.nav}`}>\n          <li>\n            <Link href=\"/\">\n              <a>Overview</a>\n            </Link>\n          </li>\n          <li>\n            {' '}\n            <Link href=\"/docs\">\n              <a>Docs</a>\n            </Link>\n          </li>\n          <li>\n            <Link href=\"/plugin\">\n              <a>Extend</a>\n            </Link>\n          </li>\n          <li>\n            <a href=\"https://www.hashicorp.com/privacy\">Privacy</a>\n          </li>\n          <li>\n            <Link href=\"/security\">\n              <a>Security</a>\n            </Link>\n          </li>\n          <li>\n            <Link href=\"/assets/files/press-kit.zip\">\n              <a>Press Kit</a>\n            </Link>\n          </li>\n          <li>\n            <a onClick={openConsentManager}>Consent Manager</a>\n          </li>\n        </ul>\n      </div>\n    </footer>\n  )\n}\n",
// 							"newFileContent": "import s from './style.module.css'\nimport Link from 'next/link'\nexport default function Footer({ openConsentManager }) {\n  return (\n    <footer className={s.footer}>\n      <div className=\"g-grid-container\">\n        <ul className={`${s.footerLinks} ${s.nav}`}>\n          <li>\n            <Link href=\"/\">Overview</Link>\n          </li>\n          <li>\n            {' '}\n            <Link href=\"/docs\">Docs</Link>\n          </li>\n          <li>\n            <Link href=\"/plugin\">Extend</Link>\n          </li>\n          <li>\n            <a href=\"https://www.hashicorp.com/privacy\">Privacy</a>\n          </li>\n          <li>\n            <Link href=\"/security\">Security</Link>\n          </li>\n          <li>\n            <Link href=\"/assets/files/press-kit.zip\">Press Kit</Link>\n          </li>\n          <li>\n            <a onClick={openConsentManager}>Consent Manager</a>\n          </li>\n        </ul>\n      </div>\n    </footer>\n  )\n}\n",
// 							"title": "Rewrite",
// 							"actions": []
// 					},
// 					{
// 							"jobHash": "Z8ZY3XgeM0OQXTKpBnG1hXtrtGU" as JobHash,
// 							"jobKind": 1,
// 							"oldFileTitle": null,
// 							"newFileTitle": "/pages/404.tsx",
// 							"oldFileContent": "import Link from 'next/link'\nimport { useErrorPageAnalytics } from '@hashicorp/platform-analytics'\nexport default function NotFound() {\n  useErrorPageAnalytics(404)\n  return (\n    <div id=\"p-404\" className=\"g-grid-container\">\n      <h1 className=\"g-type-display-1\">Page Not Found</h1>\n      <p>\n        We&lsquo;re sorry but we can&lsquo;t find the page you&lsquo;re looking\n        for.\n      </p>\n      <p>\n        <Link href=\"/\">\n          <a>Back to Home</a>\n        </Link>\n      </p>\n    </div>\n  )\n}\n",
// 							"newFileContent": "import Link from 'next/link'\nimport { useErrorPageAnalytics } from '@hashicorp/platform-analytics'\nexport default function NotFound() {\n  useErrorPageAnalytics(404)\n  return (\n    <div id=\"p-404\" className=\"g-grid-container\">\n      <h1 className=\"g-type-display-1\">Page Not Found</h1>\n      <p>\n        We&lsquo;re sorry but we can&lsquo;t find the page you&lsquo;re looking\n        for.\n      </p>\n      <p>\n        <Link href=\"/\">Back to Home</Link>\n      </p>\n    </div>\n  )\n}\n",
// 							"title": "Rewrite",
// 							"actions": []
// 					}
// 			]
// 	}
// }

const getViewComponent = (
	view: View,
	postMessage: (arg: JobAction) => void,
) => {
	switch (view.viewId) {
		case 'jobDiffView':
			const { data, title } = view.viewProps;

			return (
				<JobDiffViewContainer
					title={title}
					jobs={data}
					postMessage={postMessage}
				/>
			);

		default:
			return null;
	}
};

function App() {
	const [view, setView] = useState<View | null>(null);

	const eventHandler = useCallback(
		(event: MessageEvent<WebviewMessage>) => {
			const { data: message } = event;
			if (message.kind === 'webview.global.setView') {
				setView(message.value);
			}

			if (view === null) {
				return;
			}

			if (
				message.kind === 'webview.diffView.updateDiffViewProps' &&
				view.viewId === 'jobDiffView'
			) {
				const jobHash = message.data.jobHash;
				const nextData = view.viewProps.data.map((element) =>
					element.jobHash === jobHash ? message.data : element,
				);

				setView({
					...view,
					viewProps: {
						...view.viewProps,
						data: nextData,
					},
				});
			}
			if (
				message.kind === 'webview.diffview.rejectedJob' &&
				view.viewId === 'jobDiffView'
			) {
				const jobHash = message.data[0];
				const nextData = view.viewProps.data.filter(
					(element) => element.jobHash !== jobHash,
				);

				setView({
					...view,
					viewProps: {
						...view.viewProps,
						data: nextData,
					},
				});
			}

			if (message.kind === 'webview.diffView.focusFile') {
				const elementId = `diffViewContainer-${message.jobHash}`;
				const element = document.getElementById(elementId);
				element?.scrollIntoView();
			}
		},
		[view],
	);

	useEffect(() => {
		window.addEventListener('message', eventHandler);

		return () => {
			window.removeEventListener('message', eventHandler);
		};
	}, [eventHandler, view]);

	useEffect(() => {
		vscode.postMessage({ kind: 'webview.global.afterWebviewMounted' });
	}, []);

	const postMessage = (event: JobAction) => {
		vscode.postMessage({
			kind: event.command,
			value: event.arguments,
		});
	};

	if (!view) {
		return null;
	}

	return <main className="App">{getViewComponent(view, postMessage)}</main>;
}
export type { JobDiffViewProps };
export default App;
