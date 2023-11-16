import React from 'react';
import * as S from './ComponentStyled';

export default function AutoControl() {
  return (
    <div>
      <S.Title>Auto Control</S.Title>
      <S.GeneralText style={{ fontWeight: 'bold', fontSize: '22px ', marginTop: '5px' }}>
        Input Target Name
      </S.GeneralText>

      <div style={{ display: 'flex', marginTop: '1.5vh', alignItems: 'center' }}>
        <S.GeneralText style={{ marginRight: '2vh', fontSize: '2vh', fontWeight: '500' }}>Name:</S.GeneralText>
        <div style={{ border: '1px solid white', width: '24vh', height: '2.5vh' }}></div>
        <S.SubmitBtn style={{ marginLeft: '12.8vh' }}>submit</S.SubmitBtn>
      </div>
      <S.SeperateLine />
    </div>
  );
}
