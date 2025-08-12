import { LuX } from 'react-icons/lu';

import { type NodeData } from '../lib/cms';

type InfoProps = {
    data: (NodeData & { id: string }) | null;
    onClose: () => void;
};

export const Info = ({ data, onClose }: InfoProps) => {
    if (!data) {
        return null;
    }
    return (
        <div className="fixed inset-x-4 top-3/4 -translate-y-1/2 md:inset-x-auto md:right-4 md:top-4 md:translate-y-0 md:w-96 max-h-[80vh] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden">
            <div className="flex flex-col h-full max-h-[80vh]">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">{data.name}</h2>
                    <button onClick={onClose}>
                        <LuX className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Tên</label>
                            <p className="text-lg font-medium text-gray-900">{data.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
