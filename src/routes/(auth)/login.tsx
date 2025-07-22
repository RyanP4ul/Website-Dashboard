import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from "react";
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/password-input';
import {useTitle} from "@/hooks/useTitle.ts";
import { useAuth } from '@/context/AuthProvider';
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';

export const Route = createFileRoute('/(auth)/login')({
  component: Login,
})

const APP_NAME = import.meta.env.VITE_APP_NAME;

const formSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Please enter your name' }),
    password: z
        .string()
        .min(1, {
            message: 'Please enter your password',
        })
        .min(2, {
            message: 'Password must be at least 7 characters long',
        }),
})

function Login() {
    const { isLoggedIn } = useAuth()

    if (isLoggedIn) {
        return <div className='container mx-auto p-4'>You are already logged in.</div>;
    }

    useTitle("Login");

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            password: '',
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true)
        console.log(data)

        axios.post('http://localhost:3000/api/auth/login', {
            name: data.name,
            password: data.password,
        })
        .then((response) => {
            localStorage.setItem('token', response.data.token);
            navigate({ to: '/' });
        })
        .catch((error) => {
            for (const key in error.response?.data?.errors || {}) {
                form.setError(key as keyof z.infer<typeof formSchema>, {
                    type: 'server',
                    message: error.response.data.errors[key],
                });
            }
        })
        .finally(() => {
           setTimeout(() => {
            setIsLoading(false)
           }, 1000)
        });
    }

    return (
        <div className='bg-primary-foreground container grid h-svh max-w-none items-center justify-center'>
            <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
                <div className='mb-4 flex items-center justify-center'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='mr-2 h-6 w-6'
                    >
                        <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
                    </svg>
                    <h1 className='text-xl font-medium'>{APP_NAME}</h1>
                </div>

                <Card className='gap-4'>
                    <CardHeader>
                        <CardTitle className='text-lg tracking-tight'>Login</CardTitle>
                        <CardDescription>
                            Enter your name and password below to <br />
                            log into your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>


                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="grid gap-3"
                            >
                                <div>
                                    <FormField
                                        control={form.control}
                                        name='name'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder='Enter your name' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem className='relative'>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <PasswordInput placeholder='Password' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            <Link
                                                to='/'
                                                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
                                            >
                                                Forgot password?
                                            </Link>
                                        </FormItem>
                                    )}
                                />
                                <Button className='mt-2' disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2Icon className="mr-2 animate-spin h-4 w-4" />
                                            Loading...
                                        </>
                                    ) : (
                                        <span>Login</span>
                                    )}
                            
                                </Button>

                                <div className='relative my-2'>
                                    <div className='absolute inset-0 flex items-center'>
                                        <span className='w-full border-t' />
                                    </div>
                                    <div className='relative flex justify-center text-xs uppercase'>
                                        <span className='bg-background text-muted-foreground px-2'>
                                          Or continue with
                                        </span>
                                    </div>
                                </div>
                            </form>
                        </Form>

                    </CardContent>
                    <CardFooter>
                        <p className='text-muted-foreground px-8 text-center text-sm'>
                            By clicking login, you agree to our{' '}
                            <a
                                href='/terms'
                                className='hover:text-primary underline underline-offset-4'
                            >
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a
                                href='/privacy'
                                className='hover:text-primary underline underline-offset-4'
                            >
                                Privacy Policy
                            </a>
                            .
                        </p>
                    </CardFooter>
                </Card>

            </div>
        </div>
    )
}

