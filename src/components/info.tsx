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
        <div className="fixed inset-x-4 top-3/4 z-50 max-h-[80vh] -translate-y-1/2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl md:inset-x-auto md:top-4 md:right-4 md:w-96 md:translate-y-0">
            <div className="flex h-full max-h-[80vh] flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-neutral-dark">{data.name}</h2>
                    <button onClick={onClose}>
                        <LuX className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-neutral-primary">Tên</label>
                            <p className="text-lg font-medium text-neutral-dark">{data.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
