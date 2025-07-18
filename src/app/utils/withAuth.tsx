"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';

function withAuth<P>(WrappedComponent: React.ComponentType<P>) {
  return function ProtectedRoute(props: React.PropsWithChildren<P>) {
    const router = useRouter()

    useEffect(() => {
      const token = sessionStorage.getItem('token') || null
      if (!token) {
        router.push('/authorization/login')
      }
    }, [router])

    return <WrappedComponent {...props} />
  }
}


export default withAuth;