// @ts-nocheck
import React from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import FormProvider from '../../components/hook-form/FormProvider'
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Stack } from '@mui/material';
import { RHFTextField } from '../../components/hook-form';

const ResetPasswordForm = () => {

  const loginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues
  });

  const {reset, setError, handleSubmit, formState:{errors}}
   = methods;

   const onSubmit = async (data) =>{
        try {
            //submit data to backend
            console.log('Data', data)
        } catch (error) {
            console.log(error);
            reset();
            setError('afterSubmit',{
                ...error,
                message: error.message
            })
        }
   }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
            {!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}
        
        <RHFTextField name='email' label='Email address'/>
        <Button fullWidth color='inherit' size='large' type='submit' variant='contained'
        sx={{bgcolor:'text.primary', color:(theme)=> theme.palette.mode === 'light' ?
         'common.white':'grey.800', '&:hover':{bgcolor:'text.primary', color:(theme)=> 
         theme.palette.mode === 'light' ?
         'common.white':'grey.800'}}}>Reset Password</Button>
        </Stack>
    </FormProvider>
  )
}

export default ResetPasswordForm
