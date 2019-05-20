import React from 'react';
import styled from 'styled-components';

export default props => {

    return (
        <ForgetPage>
            <div className="forget-wrapper">
                <div className="forget-title">
                    忘記密碼
                </div>
                <div className="forget-desc">
                    如您遺失了密碼，請輸入你的註冊用戶名稱和電話，我們會產生一個全新的密碼並以訊息傳送給到您，收到密碼後，請記得更改密碼
                </div>
                <div className="forget-item">
                    <div className="forget-item-title">
                        用戶名稱
                    </div>
                    <div className="forget-item-input">
                        <input
                            placeholder="用戶名稱"
                            value={props.username}
                            onChange={event => props.onValueChange('username', event.target.value)}
                        />
                    </div>
                </div>
                <div className="forget-item">
                    <div className="forget-item-title">
                        電話號碼
                    </div>
                    <div className="forget-item-input">
                        <input
                            placeholder="電話號碼"
                            value={props.tele}
                            onChange={event => props.onValueChange('tele', event.target.value)}
                        />
                    </div>
                </div>
                <div className="foget-button" onClick={() => props.onSubmit()}>
                    提交
                </div>
                <div className="foget-button-back" onClick={() => props.onBack()}>
                    返回
                </div>
            </div>
        </ForgetPage>
    )
}

const ForgetPage = styled.div`
    height: 100%;
    width: 100%;
    background-size: cover;
    position: absolute;
    z-index: 0;
    background: #000;

    &> .fogrt-back{
        &> .fogrt-back-icon{
            height: 5rem;
            width: 5rem;
            display: flex;
            justify-content: center;
            align-items: center;

            &> i{
                color: #FFF;
                font-size: 3.5rem;
            }
        }
    }
    
    &> .forget-wrapper{
        margin: 5vh 10vw;
        background: #333333;
        padding: 5vh 10vw;

        &> .forget-title{
            display: flex;
            justify-content: center;
            color: #fff;
            font-size: 1.8rem;
            padding: 0.5rem;
            border-bottom: 1px solid;
        }
    
        &> .forget-desc{
            margin: 1vh 0;
            color: #FFF;
            font-size: 1.2rem;
        }
    
        &> .forget-item{
            padding: 1rem 0px;
    
            &> .forget-item-title{
                padding: 0.5rem;
                color: #FFF;
            }
    
            &> .forget-item-input{
                &> input{
                    width: 100%;
                    border: 1px solid #FFF;
                    background: #333333;
                    font-size: 1.4rem;
                    height: 3rem;
                    color: #FFF;
                    padding: 0 0.5rem;
                }
            }
        }
    
        &> .foget-button{
            width: 100%;
            height: 3.4rem;
            background: #51AF53;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5rem;
            color: #FFF;
            margin-top: 2rem;
        }

        &> .foget-button-back{
            width: 100%;
            height: 3.4rem;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5rem;
            color: #FFF;
            border: 1px solid #FFF;
            margin-top: 2rem;
        }
    }
`
