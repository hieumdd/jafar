import { GoogleSpreadsheet } from 'google-spreadsheet';
import { GoogleAuth } from 'google-auth-library';

import { spreadSheetId } from './settings';

const scopes = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.readonly'];
const auth = new GoogleAuth({ scopes });
const doc = new GoogleSpreadsheet(spreadSheetId, auth);

export type NodeData = {
    id: string;
    name: string;
    isInactive: boolean;
    isDeceased: boolean;
    gender: 1 | 0;
    fatherId: string | null;
    motherId: string | null;
};

export type EdgeData = {
    id: string;
    sourceId: string;
    targetId: string;
    gender: 1 | 0;
};

export const getCMS = async () => {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Nodes'];
    const rows = await sheet.getRows();

    const nodes: NodeData[] = rows
        .map((row) => ({
            id: row.get('id'),
            name: row.get('name'),
            isInactive: row.get('is_inactive') === 'FALSE',
            isDeceased: row.get('is_deceased') === 'TRUE',
            gender: parseInt(row.get('gender')) as 1 | 0,
            fatherId: row.get('father_id') ?? null,
            motherId: row.get('mother_id') ?? null,
        }))
        .filter((node) => !!node.isInactive);

    const edges: EdgeData[] = [];
    for (const node of nodes) {
        if (node.fatherId) {
            edges.push({ id: `${node.fatherId}|${node.id}`, sourceId: node.id, targetId: node.fatherId, gender: 1 });
        }
        if (node.motherId) {
            edges.push({ id: `${node.motherId}|${node.id}`, sourceId: node.id, targetId: node.motherId, gender: 0 });
        }
    }

    return { nodes, edges };
};

export type CMS = Awaited<ReturnType<typeof getCMS>>;
