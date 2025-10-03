import {Alert, Box, Button, InputAdornment, Paper, Stack, TextField, Typography} from "@mui/material";
import {LockRounded, Person3Rounded} from '@mui/icons-material';
import bgImage from '../../assets/mikahil_nilov_pexels.webp';
import logo from '../../assets/favicon.webp'
import {type FormEvent, useState} from "react";
import useAuth from "../../hooks/useAuth.ts";
import type {LoginPayload} from "../../types/Login.ts";
import {sha256} from "js-sha256";
import {useLocation, useNavigate} from "react-router-dom";

export default function LoginPage() {
    const auth = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from: string = location.state?.from || '/';

    const [user, setUser] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        try {
            const hashedPassword = sha256(password);
            const payload: LoginPayload = {
                username: user,
                passwordHash: hashedPassword
            };

            await auth.login(payload)
            navigate(from, {replace: true});

        } catch(error: Error | any) {
            setError(error?.message ?? 'Inicio de sesión fallido. Contacta al administrador para más detalles.')
        }
    }

    return (
        <>
            <Box
                component={'img'}
                src={bgImage}
                alt={"Imagen de fondo"}
                width={'100%'}
                height={'100%'}
                sx={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}
            />

            <Paper
                elevation={3}
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    minWidth: 600,
                    width: '40%',
                    height: '100%',
                    padding: 6,
                    backgroundColor: 'rgba(255, 255, 255, 0.35)',
                    backdropFilter: 'blur(25px)',
                    borderRadius: 2,
                    boxShadow: 3,

                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <Stack
                    spacing={0}
                    direction={'column'}
                    flexGrow={1}
                    sx={{
                        p: 6,
                        pr:14,
                        justifyContent: 'center',
                    }}
                    useFlexGap
                >
                    <Box component={'img'} src={logo} width={150} />
                    <Typography variant={'h3'} align={'left'}>Sistema de Baches</Typography>

                    <Typography
                        variant={'h6'}
                        align={'left'}
                        color={'#202020AA'}
                        sx={{
                            mb: 8,
                            ml: 3
                        }}
                    >
                        Bienvenido de vuelta
                    </Typography>

                    <Stack component={'form'} onSubmit={handleSubmit}>
                        <TextField
                            variant={'standard'}
                            placeholder={'Nombre de usuario o correo'}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position={'start'}>
                                            <Person3Rounded sx={{ mb: 0.2 }} />
                                        </InputAdornment>
                                    )
                                }
                            }}
                            sx={{
                                mb: 4
                            }}
                            value={user}
                            onChange={(e) => setUser(e.target.value.trim())}
                            autoFocus
                            required
                        />

                        <TextField
                            variant={'standard'}
                            placeholder={'Contraseña'}
                            type={'password'}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position={'start'}>
                                            <LockRounded sx={{ mb: 0.2 }} />
                                        </InputAdornment>
                                    )
                                }
                            }}
                            sx={{
                                mb: 6
                            }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button
                            variant={'contained'}
                            sx={{
                                height: 55
                            }}
                            disabled={user.length == 0 || password.length == 0 || auth.loading}
                            type={'submit'}
                        >
                            <Typography variant={'body1'} letterSpacing={3}>
                                { auth.loading ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN' }
                            </Typography>
                        </Button>
                    </Stack>
                </Stack>

                <Box>
                    <Typography
                        variant={'caption'}
                        textAlign={'center'}
                    >
                        Todos los derechos reservados, 2025.
                        Con amor, desde Saltillo.
                    </Typography>
                </Box>
                {error && <Alert severity={'error'} sx={{ mb: 2 }}>{error}</Alert> }
            </Paper>
        </>
    );
}