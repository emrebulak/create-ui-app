import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box } from '@mui/material';
import { User } from '../models/User';

const validationSchema = Yup.object().shape({
  id: Yup.number().required('id is required'),
  name: Yup.string().required('name is required'),
  email: Yup.string().required('email is required'),
  password: Yup.string().required('password is required'),
  created_at: Yup.string().required('created_at is required'),
  updated_at: Yup.string().required('updated_at is required'),
});

function UserForm() {
  const formik = useFormik<User>({
    initialValues: {
      id:  0 ,
      name:  "" ,
      email:  "" ,
      password:  "" ,
      created_at:  new Date() ,
      updated_at:  new Date() ,
    },
    validationSchema,
    onSubmit: (values) => {
      alert('Form submitted: ' + JSON.stringify(values, null, 2));
    },
  });

  return (
    <Box>
      <h2>User Form</h2>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          label="id"
          name="id"
          fullWidth
          margin="normal"
          value={formik.values.id }
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.id && Boolean(formik.errors.id)}
          helperText={formik.touched.id && formik.errors.id }
        />
        <TextField
          label="name"
          name="name"
          fullWidth
          margin="normal"
          value={formik.values.name }
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name }
        />
        <TextField
          label="email"
          name="email"
          fullWidth
          margin="normal"
          value={formik.values.email }
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email }
        />
        <TextField
          label="password"
          name="password"
          fullWidth
          margin="normal"
          value={formik.values.password }
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password }
        />
        <TextField
          label="created_at"
          name="created_at"
          fullWidth
          margin="normal"
          value={formik.values.created_at }
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.created_at && Boolean(formik.errors.created_at)}
          helperText={formik.touched.created_at && formik.errors.created_at }
        />
        <TextField
          label="updated_at"
          name="updated_at"
          fullWidth
          margin="normal"
          value={formik.values.updated_at }
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.updated_at && Boolean(formik.errors.updated_at)}
          helperText={formik.touched.updated_at && formik.errors.updated_at }
        />
        <Button variant="contained" color="primary" type="submit">
          Save
        </Button>
      </form>
    </Box>
  );
}

export default UserForm;
