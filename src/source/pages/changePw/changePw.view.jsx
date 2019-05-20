import React from 'react';
import styled from 'styled-components';

export default props => {

    return (
        <ForgetPage>
            <div className="forget-wrapper">
                <div className="forget-title">
                    更改密碼
                </div>
                <div className="forget-item">
                    <div className="forget-item-title">
                        您原本的密碼
                    </div>
                    <div className="forget-item-input">
                        <input
                            placeholder="您現在的密碼"
                            type="password"
                            value={props.oldpw}
                            onChange={event => props.onValueChange('oldpw', event.target.value)}
                        />
                    </div>
                </div>
                <div className="forget-item">
                    <div className="forget-item-title">
                        新的密碼
                    </div>
                    <div className="forget-item-input">
                        <input
                            placeholder="新的密碼"
                            type="password"
                            value={props.newpw}
                            onChange={event => props.onValueChange('newpw', event.target.value)}
                        />
                    </div>
                </div>
                <div className="forget-item">
                    <div className="forget-item-title">
                        再次確認您的密碼
                    </div>
                    <div className="forget-item-input">
                        <input
                            placeholder="再次確認您的密碼"
                            type="password"
                            value={props.newpwconfirm}
                            onChange={event => props.onValueChange('newpwconfirm', event.target.value)}
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
