import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';

import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import './styles.css';
import axios from '../../api/user';
import { baseURL } from '../../api';
import { getInitColorSchemeScript } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { BorderStyle } from '@mui/icons-material';

const theme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const obj = {
    email: '',
    name: '',
    nickname: '',
    check_password: '',
    password: '',
    phone: '',
    userId: '',
  };
  const [phoneCheck, setPhoneCheck] = useState('');
  const [idCheck, setIdCheck] = useState(false);
  const [idCheck2, setIdCheck2] = useState('');
  const [idCheckCount, setIdCheckCount] = useState(0);
  const [nicknameCheck, setNicknameCheck] = useState(false);
  const [nicknameCheck2, setNicknameCheck2] = useState('');
  const [totalData, setTotalData] = useState(obj);
  const [formErrors, setFormErrors] = useState({});

  const handleLogin = async (userId, password) => {
    const body = {
      userId: totalData.userId,
      password: totalData.password,
    };

    const response = await axios.post(baseURL + '/api/v1/user/login', body);

    const resAccessToken = response.data.accessToken;
    const resEmail = response.data.email;
    const resName = response.data.name;
    const resNickname = response.data.nickname;
    const resPhone = response.data.phone;
    const resUid = response.data.uid;
    const resUserId = response.data.userId;

    // console.log(response);
    sessionStorage.setItem('accessToken', resAccessToken);
    sessionStorage.setItem('email', resEmail);
    sessionStorage.setItem('name', resName);
    sessionStorage.setItem('nickname', resNickname);
    sessionStorage.setItem('phone', resPhone);
    sessionStorage.setItem('uid', resUid);
    sessionStorage.setItem('userId', resUserId);

    if (response.status === 200) {
      navigate('/');
    } else {
      return;
    }
  };

  // ????????? ?????? ??????

  const validate = () => {
    const errors = {};
    let flag = false;

    if (!totalData.email || totalData.email.indexOf(' ') >= 0) {
      errors.email = '???????????? ????????? ?????????.';
      flag = true;
    }
    if (!totalData.name) {
      errors.name = '????????? ????????? ?????????.';
      flag = true;
    }
    if (totalData.password.length < 6) {
      errors.password = '6?????? ?????? ????????? ?????????.';
      flag = true;
    }
    if (totalData.password !== totalData.check_password) {
      errors.check_password = '??????????????? ???????????? ????????????.';
      flag = true;
    }

    if (!totalData.phone) {
      errors.phone = '??????????????? ????????? ?????????.';
      flag = true;
    }
    if (isNaN(totalData.phone.replaceAll('-', ''))) {
      errors.phone = '????????? ??????????????? ????????? ?????????.';
      flag = true;
    }

    if (!totalData.nickname) {
      errors.nickname = '???????????? ????????? ?????????.';
      flag = true;
    }
    if (!totalData.userId) {
      errors.userId = '???????????? ????????? ?????????.';
      flag = true;
    }
    if (!idCheck) {
      errors.idCheck = '??????????????? ????????????.';
      flag = true;
    }
    if (!nicknameCheck) {
      errors.nicknameCheck = '??????????????? ????????????.';
      flag = true;
    }

    // console.log(errors);
    setFormErrors(errors);
    if (flag) {
      return false;
    }
    return true;
  };

  //??? ????????? ?????? ??????.
  const handleChange = (event) => {
    {
      /* ??????????????????????????? setidcheck2*/
    }

    setNicknameCheck2('');
    setIdCheck2('');
    const { name, value } = event.target;

    setFormErrors({ ...formErrors, [name]: '' });
    setTotalData({ ...totalData, [name]: value });
    // console.log(totalData);
  };

  //???????????? ?????? ????????? ??????????????? ??????
  const handleSubmit = (event) => {
    event.preventDefault();
    const sendData = {
      email: totalData.email,
      name: totalData.name,
      nickname: totalData.nickname,
      password: totalData.password,
      phone: totalData.phone.replaceAll('-', ''),
      userId: totalData.userId,
    };
    // console.log(sendData);
    if (validate()) {
      axios.post(baseURL + '/api/v1/user/signin', sendData).then((response) => {
        // ?????? ?????? ???
        if (response.status === 200) {
          // console.log('??????');
          handleLogin();
        } else {
          // ?????? ?????? ???
          console.log('????????????  ??????');
        }
      });
    }
  };

  // ????????? ???????????? axios ??????
  const handleCheckId = async () => {
    setFormErrors({ ...formErrors, idCheck: '' });
    if (totalData.userId) {
      try {
        await axios

          .get(baseURL + `/api/v1/user/id-info/${totalData.userId}`)
          .then((response) => {
            if (response.status === 200) {
              if (response.data === '') {
                setIdCheck(true);
              } else {
                setIdCheck2('?????? ???????????? ??????????????????.');
              }

              // console.log(response);
            } else {
              console.log('??????');
            }
          });
      } catch (e) {}
    } else {
      setIdCheck2('???????????? ????????? ?????????.');
    }
  };

  //????????? ???????????? axios ??????
  const handleCheckNickname = async () => {
    setFormErrors({ ...formErrors, nicknameCheck: '' });
    if (totalData.nickname) {
      await axios
        .get(baseURL + `/api/v1/user/nickname-info/${totalData.nickname}`)
        .then((response) => {
          if (response.status === 200) {
            if (response.data === '') {
              setNicknameCheck(true);
            } else {
              setNicknameCheck2('?????? ???????????? ??????????????????.');
              setTotalData({ ...totalData, nickname: '' });
            }
          }
        });
    } else {
      setNicknameCheck2('???????????? ????????? ?????????.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            mb: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* ?????? ????????? */}
          <Link href="/">
            <Avatar
              sx={{ width: 350, height: 350 }}
              alt="Academy"
              src="/images/SsenLogo_last.png"
            ></Avatar>
          </Link>
          <Grid
            container
            sx={{
              dispaly: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <Typography
              component="h1"
              id="font_test"
              sx={{
                pl: 1,
                color: 'rgba(0, 0, 0, 0.6)',
                height: '50px',
                fontWeight: '900',
                fontSize: '30px',
              }}
            >
              ????????????
            </Typography>
            <Typography
              component="h6"
              id="font_test"
              sx={{ pl: 1, color: 'rgba(0, 0, 0, 0.6)', fontSize: '14px' }}
            >
              ????????? ????????? ???????????? ??? ???????????? ?????? ???????????? ????????? ?????????.
            </Typography>
          </Grid>
          {/* ???????????? form */}
          <Box component="form" noValidate sx={{ mt: 5 }}>
            <Grid container spacing={2}>
              {/* ?????? ?????????*/}
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  className="inputRounded"
                  fullWidth
                  id="name"
                  label="??????"
                  placeholder="????????? ???????????????"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  onChange={handleChange}
                  sx={{ mt: 2.2 }}
                  InputProps={{
                    style: { fontFamily: 'Pretendard Variable' },
                  }}
                />
                {formErrors.name && (
                  <Typography
                    id="font_test"
                    sx={{ color: 'red', pl: 2, pt: 1 }}
                  >
                    {formErrors.name}
                  </Typography>
                )}
              </Grid>

              {/* ???????????? */}
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  className="inputRounded"
                  fullWidth
                  placeholder="??????????????? ???????????????"
                  name="phone"
                  label="????????????"
                  id="phone"
                  sx={{ mt: 2 }}
                  onChange={handleChange}
                  InputProps={{
                    style: { fontFamily: 'Pretendard Variable' },
                  }}
                />
                {formErrors.phone && (
                  <Typography
                    id="font_test"
                    sx={{ color: 'red', pl: 2, pt: 1 }}
                  >
                    {formErrors.phone}
                  </Typography>
                )}
              </Grid>
              {/* ????????? ?????? */}
              <Grid item xs={12}>
                <TextField
                  className="inputRounded"
                  required
                  fullWidth
                  name="email"
                  label="?????????"
                  id="email"
                  sx={{ mt: 2 }}
                  onChange={handleChange}
                  InputProps={{
                    style: { fontFamily: 'Pretendard Variable' },
                  }}
                />
                {formErrors.email && (
                  <Typography
                    id="font_test"
                    sx={{ color: 'red', pl: 2, pt: 1 }}
                  >
                    {formErrors.email}
                  </Typography>
                )}
              </Grid>
              {/* <Grid item xs={5}>
                <Button
                  sx={{
                    background: "#DDF2FD",
                    height: "40px",
                    display: "flex",
                    mt: 1,
                    ml: 1,
                    width: "90px",
                    color: "black",
                    fontWeight: 700,
                    borderRadius: 3,
                  }}
                >
                  ????????????
                </Button>
              </Grid> */}

              {/* ????????? ?????? */}

              <Grid sx={{ mt: 10 }} item xs={7}>
                {idCheck && (
                  <TextField
                    fullWidth
                    className="inputRounded"
                    value={totalData.userId}
                    sx={{ fontWeight: 700, color: 'blue' }}
                  ></TextField>
                )}
                {!idCheck && (
                  <TextField
                    className="inputRounded"
                    required
                    fullWidth
                    name="userId"
                    label="?????????"
                    placeholder="???????????? ???????????????"
                    id="userId"
                    onChange={handleChange}
                    InputProps={{
                      style: { fontFamily: 'Pretendard Variable' },
                    }}
                  />
                )}
                <Typography sx={{ color: 'red', pl: 2 }}>{idCheck2}</Typography>

                {formErrors.idCheck && (
                  <Typography
                    id="font_test"
                    sx={{ color: 'red', pl: 2, pt: 1 }}
                  >
                    {formErrors.idCheck}
                  </Typography>
                )}
              </Grid>
              <Grid sx={{ mt: 10 }} item xs={5}>
                {idCheck && (
                  <Typography
                    id="font_test"
                    sx={{ color: 'blue', pl: 2, pt: 1 }}
                  >
                    ????????? ??? ?????? ??????????????????.
                  </Typography>
                )}

                {!idCheck && (
                  <Button
                    onClick={handleCheckId}
                    sx={{
                      background: '#bfdcfd',
                      height: '40px',
                      display: 'flex',
                      mt: 1,
                      ml: 1,
                      width: '90px',
                      color: 'black',

                      borderRadius: 3,
                      fontFamily: 'MICEGothic Bold',
                    }}
                  >
                    ????????????
                  </Button>
                )}
              </Grid>

              {/* ???????????? ?????? */}
              <Grid item xs={12}>
                <TextField
                  className="inputRounded"
                  required
                  fullWidth
                  name="password"
                  label="????????????"
                  placeholder="6?????? ?????? ???????????????"
                  id="password"
                  type="password"
                  sx={{ mt: 2 }}
                  onChange={handleChange}
                  InputProps={{
                    style: { fontFamily: 'Pretendard Variable' },
                  }}
                />
                {formErrors.password && (
                  <Typography
                    id="font_test"
                    sx={{ color: 'red', pl: 2, pt: 1 }}
                  >
                    {formErrors.password}
                  </Typography>
                )}
              </Grid>
              {/* ???????????? ?????? */}
              <Grid item xs={12}>
                <TextField
                  sx={{ mt: 2 }}
                  className="inputRounded"
                  required
                  fullWidth
                  name="check_password"
                  onChange={handleChange}
                  label="???????????? ??????"
                  id="check_password"
                  type="password"
                />
                {formErrors.check_password && (
                  <Typography
                    id="font_test"
                    sx={{ color: 'red', pl: 2, pt: 1 }}
                  >
                    {formErrors.check_password}
                  </Typography>
                )}
              </Grid>
              {/* ????????? ?????? */}
              <Grid sx={{ mt: 7 }} item xs={7}>
                {nicknameCheck && (
                  <TextField
                    fullWidth
                    className="inputRounded"
                    value={totalData.nickname}
                  ></TextField>
                )}
                {!nicknameCheck && (
                  <TextField
                    placeholder="????????? ???????????? ???????????????"
                    className="inputRounded"
                    required
                    fullWidth
                    label="?????????"
                    name="nickname"
                    value={totalData.nickname}
                    id="nickname"
                    onChange={handleChange}
                    InputProps={{
                      style: { fontFamily: 'Pretendard Variable' },
                    }}
                  />
                )}
                <Typography sx={{ color: 'red', pl: 1 }}>
                  {nicknameCheck2}
                </Typography>
                {formErrors.nicknameCheck && (
                  <Typography
                    id="font_test"
                    sx={{ color: 'red', pl: 2, pt: 1 }}
                  >
                    {formErrors.nicknameCheck}
                  </Typography>
                )}
              </Grid>
              <Grid sx={{ mt: 7 }} item xs={5}>
                {nicknameCheck && (
                  <Typography
                    id="font_test"
                    sx={{ color: 'blue', pl: 2, pt: 1 }}
                  >
                    ????????? ??? ?????? ??????????????????.
                  </Typography>
                )}
                {!nicknameCheck && (
                  <Button
                    onClick={handleCheckNickname}
                    sx={{
                      background: '#bfdcfd',
                      height: '40px',
                      display: 'flex',
                      mt: 1,
                      ml: 1,
                      color: 'black',
                      width: '90px',
                      borderRadius: 3,
                      fontFamily: 'MICEGothic Bold',
                    }}
                  >
                    ????????????
                  </Button>
                )}
              </Grid>
            </Grid>
            {/* ???????????? ?????? */}
            <Button
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              sx={{ mt: 10, mb: 2, borderRadius: '20px' }}
            >
              <Typography id="font_test" component="h6" variant="h6">
                ????????????
              </Typography>
            </Button>
            <Grid container justifyContent="flex-end">
              {/* ????????? ???????????? ?????? */}
              <Grid item>
                <Typography
                  sx={{ pl: 1, fontSize: '14px' }}
                  style={{ color: '#808080', fontFamily: 'MICEGothic Bold' }}
                >
                  ?????? ????????? ????????????????&nbsp;
                  <Link
                    href="/login"
                    variant="body2"
                    id="font_test"
                    style={{ color: 'rgb(21 120 219)', textDecoration: 'none' }}
                  >
                    ?????????
                  </Link>
                  ??????
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
