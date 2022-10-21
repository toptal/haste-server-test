import db from '~/lib/db'
import tables from '~/lib/db/tables'

const recordDocument = async (
  documentId: string,
  userId: string,
  ipaddress: string
): Promise<void> => {
  await db(tables.DOCUMENTS).insert({ id: documentId, userId, ipaddress })
}

export default recordDocument
