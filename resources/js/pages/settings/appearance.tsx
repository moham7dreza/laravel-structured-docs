import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';
import { index as settingsIndex } from '@/routes/settings';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: settingsIndex().url,
    },
];

export default function Appearance() {
    const { t } = useTranslation();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.appearanceSettings')} />

            <h1 className="sr-only">{t('settings.appearanceSettings')}</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title={t('settings.appearanceSettings')}
                        description={t('settings.appearanceSettingsDesc')}
                    />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
