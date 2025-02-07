import React from 'react';
import { PasswordInput, Anchor, Paper, Title, Text, Container, Group, Button } from '@mantine/core';
import { setCookies } from 'cookies-next';
import { useForm } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import axios from 'axios';
import { IconCheck, IconX } from '@tabler/icons';

// TODO: Add links to the wiki articles about the login process.
export default function AuthenticationTitle() {
  const form = useForm({
    initialValues: {
      password: '',
    },
  });
  return (
    <Container
      size={420}
      style={{
        height: '100vh',
        display: 'flex',
        width: 420,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Title
        align="center"
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
      >
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Please enter the{' '}
        <Anchor<'a'> href="#" size="sm" onClick={(event) => event.preventDefault()}>
          password
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md" style={{ width: 420 }}>
        <form
          onSubmit={form.onSubmit((values) => {
            setCookies('password', values.password, {
              maxAge: 60 * 60 * 24 * 30,
              sameSite: 'lax',
            });
            showNotification({
              id: 'load-data',
              loading: true,
              title: 'Checking your password',
              message: 'Your password is being checked...',
              autoClose: false,
              disallowClose: true,
            });
            axios
              .post('/api/configs/tryPassword', {
                tried: values.password,
              })
              .then((res) => {
                setTimeout(() => {
                  if (res.data.success === true) {
                    updateNotification({
                      id: 'load-data',
                      color: 'teal',
                      title: 'Password correct',
                      message:
                        'Notification will close in 2 seconds, you can close this notification now',
                      icon: <IconCheck />,
                      autoClose: 300,
                      onClose: () => {
                        window.location.reload();
                      },
                    });
                  }
                  if (res.data.success === false) {
                    updateNotification({
                      id: 'load-data',
                      color: 'red',
                      title: 'Password is wrong, please try again.',
                      message:
                        'Notification will close in 2 seconds, you can close this notification now',
                      icon: <IconX />,
                      autoClose: 2000,
                    });
                  }
                }, 500);
              });
          })}
        >
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps('password')}
          />
          <Group position="apart" mt="md">
            <Anchor<'a'> onClick={(event) => event.preventDefault()} href="#" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth type="submit" mt="xl">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
