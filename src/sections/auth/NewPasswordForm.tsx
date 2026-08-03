// @ts-nocheck
import React  from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import FormProvider from '../../components/hook-form/FormProvider'
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, IconButton, InputAdornment, Stack } from '@mui/material';
import { Eye, EyeSlash } from 'phosphor-react';
import { RHFTextField } from '../../components/hook-form';

const NewPasswordForm = () => {

  const [showPassword, setShowPassword] = React.useState(false);

  const NewPasswordSchema = Yup.object().shape({
    newPassword: Yup.string().required('New Password is required'),
    confirmPassword: Yup.string().required('Confirm Password is required'),
  });

  const defaultValues = {
    newPassword: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewPasswordSchema),
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
        
        <RHFTextField name='newPassword' label='New Password' type={showPassword ? 'text' : 'password'}
        InputProps={{endAdornment:(
            <InputAdornment position="end">
            <IconButton onClick={()=>{
                setShowPassword(!showPassword);
            }}>
                {showPassword? <Eye/> : <EyeSlash/>}
            </IconButton>
            </InputAdornment>
        )}}/>

        <RHFTextField name='confirmPassword' label='Confirm Password' type={showPassword ? 'text' : 'password'}
        InputProps={{endAdornment:(
            <InputAdornment position="end">
            <IconButton onClick={()=>{
                setShowPassword(!showPassword);
            }}>
                {showPassword? <Eye/> : <EyeSlash/>}
            </IconButton>
            </InputAdornment>
        )}}/>
       
        <Button fullWidth color='inherit' size='large' type='submit' variant='contained'
        sx={{bgcolor:'text.primary', color:(theme)=> theme.palette.mode === 'light' ?
         'common.white':'grey.800', '&:hover':{bgcolor:'text.primary', color:(theme)=> 
         theme.palette.mode === 'light' ?
         'common.white':'grey.800'}}}>Submit</Button>
        </Stack>
    </FormProvider>
  )
}

export default NewPasswordForm
