import React from 'react';
import * as S from './ComponentStyled';

export default function ManualControl() {
  return (
    <div>
      <S.Title>Manual Control</S.Title>
      <S.GeneralText style={{ fontWeight: 'bold', fontSize: '22px ', marginTop: '5px' }}>
        Input Coordinate
      </S.GeneralText>

      <div style={{ display: 'flex', marginTop: '1px', marginBottom: '10px' }}>
        <S.GeneralText style={{ fontSize: '17px' }}>Latitude: &nbsp;</S.GeneralText>
        <div style={{ border: '1px solid white', width: '18vh', height: '2.5vh' }}></div>
        <S.GeneralText style={{ fontSize: '17px', marginLeft: '3vh' }}>Azimuth: &nbsp;</S.GeneralText>
        <div style={{ border: '1px solid white', width: '18vh', height: '2.5vh' }}></div>
      </div>
      <S.SubmitBtn style={{ position: 'relative', left: '450px' }}>submit</S.SubmitBtn>

      <S.GeneralText style={{ fontWeight: 'bold', fontSize: '22px ', marginTop: '10px', marginBottom: '5px' }}>
        Precise Control
      </S.GeneralText>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', marginBottom: '20px' }}>
            <S.GeneralText style={{ marginRight: '20px' }}>L Rate:</S.GeneralText>
            <div style={{ border: '1px solid white', width: '18vh', height: '2.5vh' }}></div>
          </div>
          <div style={{ display: 'flex' }}>
            <S.GeneralText style={{ marginRight: '19px' }}>R Rate:</S.GeneralText>
            <div style={{ border: '1px solid white', width: '18vh', height: '2.5vh' }}></div>
          </div>
        </div>

        <div style={{ marginLeft: '10vh' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <S.DirectionBtn>▲</S.DirectionBtn>
          </div>
          <div style={{ display: 'inline-flex' }}>
            <S.DirectionBtn>◀</S.DirectionBtn>
            <S.DirectionBtn>▼</S.DirectionBtn>
            <S.DirectionBtn>▶</S.DirectionBtn>
          </div>
        </div>
      </div>
      <S.SeperateLine />
    </div>
  );
}
