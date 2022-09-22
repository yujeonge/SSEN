// 보유 원화 모달창으로 입력하는 부분
import React, { useEffect } from "react";
import { useState } from "react";
import { Axios } from "axios";

//mui
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";

// 모달창 스타일
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

// 국가 선택 select box
const BasicSelect = ({ code, setCode }) => {
  const handleChange = (event) => {
    setCode(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">code Code</InputLabel>
        <Select
          id="code_code"
          value={code}
          label="code_code"
          onChange={handleChange}
        >
          <MenuItem value="USD">USD</MenuItem>
          <MenuItem value="EUR">EUR</MenuItem>
          <MenuItem value="GBP">GBP</MenuItem>
          <MenuItem value="CNY">CNY</MenuItem>
          <MenuItem value="JPY">JPY</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

// 숫자만 입력 가능하게 해 놓은 것(0 입력 방지)
const enteredOnlyNumber = (val) => {
  return val.replace(/[^0-9]/g, "");
};
// 천 단위 ',' 자동 입력을 위한 것
const addComma = (num) => {
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 모달창
export default function BasicModal(props) {
  const [code, setCode] = useState(""); //국가선택
  const [quantity, setQuantity] = useState(""); //양
  const [price, setPrice] = useState(""); //구매 금액
  const [isEnteredWrongAmount, setIsEnteredWrongAmount] = useState(false);

  // 세션에 저장된 데이터가 있으면 가져오기 위한 것
  const [userId, setUserId] = useState(() => sessionStorage.getItem("userId"));

  // 값 변경시 세션 적용을 위한 것
  useEffect(() => {
    sessionStorage.setItem("userId", userId);
  }, [userId]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = (e) => {
    setOpen(false);
    setQuantity(""); //close 후 창 비우기
    setCode("");
    setPrice("");
  };

  // const sendMyAsset = () => {
  //   const body = {
  //     code:code,
  //     price:price,
  //     quantity:quantity,
  //     userId:userId,
  //   };
  //   Axios.create({

  //   })
  // }

  const handleSumit = (e) => {
    e.preventDefault(); //새로고침 방지
    if (!code || !quantity || !price) return; // 아무것도 입력하지 않았을 때, submit 방지
    props.onSubmit(code, quantity, price);
    setOpen(false); //submit 후 창 닫기
    setCode("");
    setQuantity("");
    setPrice(""); //submit 창 비우기
  };

  // 천단위별 ',' 자동 입력 되게 하는 함수(quantity)
  const amountQuantity = (event) => {
    const isNotNumber = /^[^1-9][^0-9]{0,11}$/g.test(event.target.value)
      ? true
      : false;
    setIsEnteredWrongAmount(isNotNumber);
    if (isNotNumber) return;

    const amount = addComma(enteredOnlyNumber(event.target.value));
    setQuantity(amount);
  };

  // 천단위별 ',' 자동 입력 되게 하는 함수(price)
  const amountPrice = (event) => {
    const isNotNumber = /^[^1-9][^0-9]{0,11}$/g.test(event.target.value)
      ? true
      : false;
    setIsEnteredWrongAmount(isNotNumber);
    if (isNotNumber) return;

    const amount = addComma(enteredOnlyNumber(event.target.value));
    setPrice(amount);
  };

  return (
    <div>
      <Button id="font_test" variant="contained" onClick={handleOpen}>
        보유 외화 추가하기
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* 모달창 내부 */}
          <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
            {/* 보유 외화 title */}
            <Typography
              id="font_test"
              gutterBottom
              variant="h5"
              component="div"
            >
              보유 외화 등록
            </Typography>
            <Box sx={{ m: 2 }}>
              <BasicSelect code={code} setCode={setCode} />
            </Box>
            <Box sx={{ my: 3, mx: 2 }}>
              <Grid container alignItems="center">
                <Grid item xs>
                  <TextField
                    name="quantity"
                    fullWidth
                    type="text"
                    value={quantity}
                    onChange={amountQuantity}
                    placeholder="보유하신 원화의 양을 입력하세요"
                    required
                  />
                </Grid>
              </Grid>
              <Grid container alignItems="center">
                <Grid item xs sx={{ mt: 2 }}>
                  <TextField
                    name="price"
                    fullWidth
                    type="text"
                    value={price}
                    onChange={amountPrice}
                    placeholder="구매한 금액을 입력하세요."
                    required
                  />
                </Grid>
              </Grid>
            </Box>
            <Stack mt={1} spacing={1} direction="row" justifyContent="center">
              <Button variant="contained" onClick={handleSumit} id="font_test">
                등록
              </Button>
              <Button variant="outlined" onClick={handleClose} id="font_test">
                취소
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}