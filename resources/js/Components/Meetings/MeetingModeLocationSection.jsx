import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { MapPin, Video } from 'lucide-react';

export default function MeetingModeLocationSection({
    meetingMode,
    platform,
    location,
    onModeChange,
    onPlatformChange,
    onLocationChange,
    errors = {},
}) {
    return (
        <div className="space-y-4">
            <div>
                <InputLabel value="Mode Pertemuan Rapat" />
                <div className="mt-1 grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => onModeChange('Offline')}
                        className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-md text-xs font-semibold border transition ${
                            meetingMode === 'Offline'
                                ? 'bg-emerald-50 border-[#194f2b] text-[#194f2b] shadow-2xs font-bold'
                                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <MapPin className="h-3.5 w-3.5" />
                        <span>Offline (Tatap Muka)</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onModeChange('Online')}
                        className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-md text-xs font-semibold border transition ${
                            meetingMode === 'Online'
                                ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs font-bold'
                                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Video className="h-3.5 w-3.5" />
                        <span>Online (Virtual Meeting)</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {meetingMode === 'Online' && (
                    <div>
                        <InputLabel htmlFor="platform" value="Platform Meeting Online" />
                        <select
                            id="platform"
                            value={platform}
                            onChange={(e) => onPlatformChange(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                        >
                            <option value="Zoom">Zoom Meeting</option>
                            <option value="Google Meet">Google Meet</option>
                            <option value="Microsoft Teams">Microsoft Teams</option>
                            <option value="Webex">Cisco Webex</option>
                        </select>
                        <InputError message={errors.platform} className="mt-1" />
                    </div>
                )}

                <div className={meetingMode === 'Online' ? 'col-span-1' : 'col-span-2'}>
                    <InputLabel
                        htmlFor="location"
                        value={meetingMode === 'Online' ? 'Link / Tautan Ruang Rapat Online' : 'Ruangan / Tempat Rapat Fisik'}
                    />
                    <TextInput
                        id="location"
                        value={location}
                        placeholder={
                            meetingMode === 'Online'
                                ? 'Contoh: https://zoom.us/j/... atau link Google Meet'
                                : 'Contoh: Ruang Rapat SPI Lt. 3, Gedung Surya Dumai'
                        }
                        className="mt-1 block w-full"
                        onChange={(e) => onLocationChange(e.target.value)}
                        required
                    />
                    <InputError message={errors.location} className="mt-1" />
                </div>
            </div>
        </div>
    );
}
