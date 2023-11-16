import React from 'react';
import * as S from './ComponentStyled';

export default function SetTelescope() {
  return (
    <div style={{ marginBottom: '10px' }}>
      <S.Title>Set Telescope</S.Title>

      <div style={{ display: 'flex', marginTop: '15px' }}>
        <S.Container>
          <S.ContainerItem>connect</S.ContainerItem>
          <S.ContainerItem>disconnect</S.ContainerItem>
          <S.ContainerItem>park</S.ContainerItem>
          <S.ContainerItem style={{ color: 'white', backgroundColor: '#fa4040' }}>abort</S.ContainerItem>
        </S.Container>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '5px' }}>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <S.HighlightText>V&nbsp;&nbsp;</S.HighlightText>
            <S.GeneralText>Connected: khuscopev1</S.GeneralText>
          </div>
          <div style={{ display: 'flex' }}>
            <S.HighlightText>V&nbsp;&nbsp;</S.HighlightText>
            <S.GeneralText>
              Current Coordinate:
              <br />
              L: 302 dec
              <br />
              A: 123 dec
            </S.GeneralText>
          </div>
        </div>
      </div>
      <S.SeperateLine />
    </div>
  );
}
