import Link from 'next/link'
import { PrismaClient, User } from '@prisma/client'
import { GetServerSideProps } from 'next/types'

import styles from '../../styles/BinPage.module.scss'

interface UsersProps {
  users: Array<User>
}

export default function Users({ users }: UsersProps): JSX.Element {
  return (
    <div className={styles.container}>
      <h1>Sample Page - Listing Users</h1>
      <br />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/">Home</Link>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = new PrismaClient()
  const users = await prisma.user.findMany()

  return {
    props: {
      users
    }
  }
}
