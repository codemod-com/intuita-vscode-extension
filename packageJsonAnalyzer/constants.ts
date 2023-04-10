import { PackageUpgradeItem } from './types';

export const commandList: Record<string, string> = {
	next13: 'intuita.executeNextJsCodemods',
	next13experimental: 'intuita.executeNextJsExperimentalCodemods',
	materialUI5: 'intuita.executeMuiCodemods',
	redwoodJS4: 'intuita.executeRedwoodJsCore4Codemods',
	reactRouterDom6: 'intuita.executeReactRouterv6Codemods',
	immutableJSV4: 'intuita.executeImmutableJSv4Codemods',
	immutableJS0: 'intuita.executeImmutableJSv0Codemods',
};

// TODO: get this from an API
export const packageUpgradeList: PackageUpgradeItem[] = [
	{
		id: 'next13',
		packageName: 'next',
		name: 'Next13 Codemods',
		kind: 'upgrade',
		leastVersionSupported: '13.0.0',
		latestVersionSupported: '13.2.4',
		leastSupportedUpgrade: '12.0.0',
	},
	{
		id: 'next13experimental',
		packageName: 'next',
		name: 'Next13 Experimental Codemods',
		kind: 'upgrade',
		leastVersionSupported: '13.0.0',
		latestVersionSupported: '13.2.4',
		leastSupportedUpgrade: '12.0.0',
	},
	{
		id: 'materialUI5',
		packageName: '@material-ui/core',
		name: 'MaterialUI5 Codemods',
		kind: 'migration',
		leastVersionSupported: '5.0.0',
		latestVersionSupported: '5.11.15',
		leastSupportedUpgrade: '4.0.0',
	},
	{
		id: 'redwoodJS4',
		packageName: '@redwoodjs/core',
		name: 'RedwoodJS4 Codemods',
		kind: 'migration',
		leastVersionSupported: '4.0.0',
		latestVersionSupported: '4.0.0',
		leastSupportedUpgrade: '3.0.0',
	},
	{
		id: 'reactRouterDom6',
		packageName: 'react-router-dom',
		name: 'ReactRouterDom6 Codemods',
		kind: 'migration',
		leastVersionSupported: '6.0.0',
		latestVersionSupported: '6.9.0',
		leastSupportedUpgrade: '5.0.0',
	},
	{
		id: 'immutableJSV4',
		packageName: 'immutable',
		name: 'ImmutableJS4 Codemods',
		kind: 'upgrade',
		leastVersionSupported: '4.0.0',
		latestVersionSupported: '4.0.0',
		leastSupportedUpgrade: '3.0.0',
	},
	{
		id: 'immutableJS0',
		packageName: 'immutable',
		name: 'ImmutableJS4 removal Codemods',
		kind: 'remove',
		leastVersionSupported: '4.0.0',
		latestVersionSupported: '4.0.0',
		leastSupportedUpgrade: '3.0.0',
	},
];

export const packageListMap = new Map<string, PackageUpgradeItem>(
	packageUpgradeList.map((item) => [item.id, item]),
);
