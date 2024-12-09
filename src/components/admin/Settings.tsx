import React, { useState } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';

interface SettingsSection {
  title: string;
  description: string;
  settings: Setting[];
}

interface Setting {
  id: string;
  label: string;
  type: 'toggle' | 'text' | 'select';
  value: any;
  options?: string[];
  description?: string;
}

export function Settings() {
  const [settings, setSettings] = useState<SettingsSection[]>([
    {
      title: 'General',
      description: 'Manage general application settings',
      settings: [
        {
          id: 'maintenance_mode',
          label: 'Maintenance Mode',
          type: 'toggle',
          value: false,
          description: 'Enable maintenance mode to prevent user access during updates',
        },
        {
          id: 'site_name',
          label: 'Site Name',
          type: 'text',
          value: 'ITA Digital Support',
          description: 'The name of your support portal',
        },
      ],
    },
    {
      title: 'Chat',
      description: 'Configure chat system settings',
      settings: [
        {
          id: 'chat_enabled',
          label: 'Enable Chat',
          type: 'toggle',
          value: true,
          description: 'Allow users to start chat sessions',
        },
        {
          id: 'chat_timeout',
          label: 'Chat Timeout (minutes)',
          type: 'select',
          value: '30',
          options: ['15', '30', '45', '60'],
          description: 'Time before inactive chat sessions are closed',
        },
      ],
    },
    {
      title: 'Tickets',
      description: 'Configure ticket system settings',
      settings: [
        {
          id: 'auto_assign',
          label: 'Auto-assign Tickets',
          type: 'toggle',
          value: true,
          description: 'Automatically assign new tickets to available support staff',
        },
        {
          id: 'ticket_categories',
          label: 'Default Category',
          type: 'select',
          value: 'general',
          options: ['general', 'technical', 'billing', 'feature_request'],
          description: 'Default category for new tickets',
        },
      ],
    },
  ]);

  const handleSettingChange = (sectionIndex: number, settingId: string, newValue: any) => {
    const newSettings = [...settings];
    const setting = newSettings[sectionIndex].settings.find(s => s.id === settingId);
    if (setting) {
      setting.value = newValue;
      setSettings(newSettings);
    }
  };

  const handleSave = async () => {
    // TODO: Implement settings save functionality
    console.log('Saving settings:', settings);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <SettingsIcon className="h-6 w-6 mr-2" />
            System Settings
          </h2>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>

        <div className="space-y-8">
          {settings.map((section, sectionIndex) => (
            <div key={section.title} className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-1">{section.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{section.description}</p>
              
              <div className="space-y-6">
                {section.settings.map((setting) => (
                  <div key={setting.id} className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <label htmlFor={setting.id} className="block text-sm font-medium text-gray-700">
                        {setting.label}
                      </label>
                      {setting.type === 'toggle' ? (
                        <button
                          type="button"
                          onClick={() => handleSettingChange(sectionIndex, setting.id, !setting.value)}
                          className={`${
                            setting.value ? 'bg-blue-600' : 'bg-gray-200'
                          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        >
                          <span
                            className={`${
                              setting.value ? 'translate-x-5' : 'translate-x-0'
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </button>
                      ) : setting.type === 'select' ? (
                        <select
                          id={setting.id}
                          value={setting.value}
                          onChange={(e) => handleSettingChange(sectionIndex, setting.id, e.target.value)}
                          className="mt-1 block w-48 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        >
                          {setting.options?.map((option) => (
                            <option key={option} value={option}>
                              {option.replace('_', ' ').toUpperCase()}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          id={setting.id}
                          value={setting.value}
                          onChange={(e) => handleSettingChange(sectionIndex, setting.id, e.target.value)}
                          className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      )}
                    </div>
                    {setting.description && (
                      <p className="mt-1 text-sm text-gray-500">{setting.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
