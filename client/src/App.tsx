import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      firstName
      lastName
      birthDate
      city
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      firstName
      lastName
      birthDate
      city
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      firstName
      lastName
      birthDate
      city
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

const App: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [city, setCity] = useState('NEW_YORK');
  const [editId, setEditId] = useState<null | string>(null);

  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const resetForm = () => {
    setEditId(null);
    setFirstName('');
    setLastName('');
    setBirthDate('');
    setCity('NEW_YORK');
  };

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await updateUser({ variables: { id: editId, input: { firstName, lastName, birthDate, city } } });
    } else {
      await createUser({ variables: { input: { firstName, lastName, birthDate, city } } });
    }
    await refetch();
    resetForm();
  };

  const onEditUser = (user: any) => {
    setEditId(user.id);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    // birthDate is ISO string: use YYYY-MM-DD for date input
    setBirthDate(user.birthDate.substring(0, 10));
    setCity(user.city);
  };

  const onDeleteUser = async (id: string) => {
    await deleteUser({ variables: { id } });
    await refetch();
    if (editId === id) {
      resetForm();
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading users.</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>User Management</h2>
      <form onSubmit={onSubmitForm}>
        <div>
          <label>First Name: <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required /></label>
        </div>
        <div>
          <label>Last Name: <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required /></label>
        </div>
        <div>
          <label>Birth Date: <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} required /></label>
        </div>
        <div>
          <label>City: <select value={city} onChange={e => setCity(e.target.value)} required>
            <option value="NEW_YORK">New York</option>
            <option value="LONDON">London</option>
            <option value="TEL_AVIV">Tel Aviv</option>
          </select></label>
        </div>
        <button type="submit">{editId ? 'Update User' : 'Create User'}</button>
        {editId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <h3>Existing Users</h3>
      <table border={1} cellPadding="4" style={{ borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr><th>Name</th><th>Birth Date</th><th>City</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {data.getUsers.map((user: any) => (
            <tr key={user.id}>
              <td>{user.firstName} {user.lastName}</td>
              <td>{new Date(user.birthDate).toLocaleDateString()}</td>
              <td>{user.city.replace('_', ' ')}</td>
              <td>
                <button onClick={() => onEditUser(user)}>Edit</button>{' '}
                <button onClick={() => onDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
