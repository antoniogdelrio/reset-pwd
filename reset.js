const { Builder, By} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('chromedriver').path;
const service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

module.exports = function(cpf, birthday, newPWD){
    function globalErrorHandler(reject){
        console.log('\n\tHouve um erro\n')
        reject("Houve um erro");
    }    

    function positiveHandler(resolve){
        console.log(`\n\tSenha resetada com sucesso ==> ${newPWD}\n`)
        resolve(`Senha resetada com sucesso ==> ${newPWD}`);
    }

    return new Promise((resolve, reject) => {
        async function main(){
            console.log(cpf, birthday, newPWD);

            var adminLoginOk = 0;
            var userCpfOk = 0;
            var birthdayOk = 0;

            //Acessando portal
            let driver = await new Builder().forBrowser('chrome').build();
            await driver.get('https://pess.portal.senaisp.edu.br/');
        
            //Login no portal
            driver.findElements(By.className('form-control ng-pristine ng-valid'))
                .then(inputs => {
                    driver.sleep(2000);
                    inputs[0].sendKeys('33855622876');
                    inputs[1].sendKeys('Leo@1234');
                    driver.findElement(By.className('btn-padrao'))
                        .then(btn => {
                            btn.click();
                        })
                        .catch(() => globalErrorHandler(reject))
                })
                .catch(() => globalErrorHandler(reject))
        
            await driver.sleep(2000)
            //Botão perfil de acesso
            driver.findElement(By.className('btn btn-primary btnSesiAcessar'))
                .then(btn => {
                    adminLoginOk = 1;
                    btn.click();
                })
                .catch(() => globalErrorHandler(reject))
        
            await driver.sleep(2000);
            if(adminLoginOk){
                    //Script para entrar no reset de senha
                driver.executeScript('showReiniciarSenha()');
            
                await driver.sleep(2000);
            
                //Digitação do CPF do aluno
                driver.findElement(By.id('txtCPFReiniciarSenha'))
                    .then(inputCPF => {
                        inputCPF.sendKeys(cpf);
                        driver.sleep(3000);
                        driver.findElements(By.className('btn btn-primary'))
                            .then(btnReset => {
                                btnReset[18].click();
                            })
                            .catch(() => globalErrorHandler(reject))
                    })
                    .catch(() => globalErrorHandler(reject))
            
                await driver.sleep(5000);
            
                //iframe de confirmação dos dados pessoais do aluno
                await driver.switchTo().defaultContent();
                await driver.findElement(By.id('InlineFrame1'))
                    .then((iframe) => {
                        userCpfOk = 1;
                        driver.switchTo().frame(iframe)
                            .then(() => {
                                driver.findElement(By.className('btn btn-lg btn-primary btn-block'))
                                    .then(btn => {
                                        btn.click();
                                    })
                                    .catch(() => globalErrorHandler(reject))
                            })
                            .catch(() => globalErrorHandler(reject))
                    })
                    .catch(() => globalErrorHandler(reject))
                
                if(userCpfOk){
                    await driver.sleep(3000);
                
                    //Ir direto para "O que fazer?"
                    await driver.get('https://pess.portal.senaisp.edu.br/Paginas/IFrame/IFrame.aspx?Link=RegistrarSenha');
                
                    //Digitação do CPF
                    await driver.switchTo().defaultContent();
                    driver.findElement(By.id('InlineFrame1'))
                        .then(iframe => {
                            driver.switchTo().frame(iframe)
                                .then(() => {
                                    driver.findElement(By.className('form-control ng-pristine ng-invalid ng-invalid-required'))
                                        .then(input => {
                                            input.sendKeys(cpf);
                                        })
                                        .catch(() => globalErrorHandler(reject))
                                })
                                .catch(() => globalErrorHandler(reject))
                        })
                        .catch(() => globalErrorHandler(reject))
                
                    await driver.sleep(2000)
                
                    //Digitação da data de nascimento
                    await driver.switchTo().defaultContent();
                    driver.findElement(By.id('InlineFrame1'))
                        .then(iframe => {
                            driver.switchTo().frame(iframe)
                                .then(() => {
                                    driver.findElement(By.className('form-control ng-scope ng-pristine ng-invalid ng-invalid-required'))
                                        .then(input => {
                                            input.sendKeys(birthday);;
                                            driver.findElement(By.className('btn btn-sm btn-primary pull-right btn-fontPadrao'))
                                                .then(btn => {
                                                    btn.click()
                                                })
                                                .catch(() => globalErrorHandler(reject))
                                        })
                                        .catch(() => globalErrorHandler(reject))
                                })
                                .catch(() => globalErrorHandler(reject))
                        })
                        .catch(() => globalErrorHandler(reject))
                
                    await driver.sleep(2000);
                        
                    //Confirmação do termo de uso
                    await driver.switchTo().defaultContent();

                    await driver.findElement(By.id('InlineFrame1'))
                        .then(async function(iframe){
                            await driver.switchTo().frame(iframe)
                                .then(async function(){
                                    await driver.findElements(By.className('ng-pristine ng-valid'))
                                        .then(checkbox => {
                                            birthdayOk = 1;
                                            checkbox[1].click();
                                        })
                                        .catch(() => globalErrorHandler(reject))
                                    if(birthdayOk){
                                        driver.sleep(2000);
                                        driver.findElements(By.className('btn btn-sm btn-primary pull-right btn-fontPadrao'))
                                            .then(nextButton => {
                                                nextButton[1].click();
                                            })
                                            .catch(() => globalErrorHandler(reject))
                                    }
                                })
                                .catch(() => globalErrorHandler(reject))
                        })
                        .catch(() => globalErrorHandler(reject))

                    if(birthdayOk){
                        await driver.sleep(2000)
                        await driver.switchTo().defaultContent();
                    
                        //E-mail + confirmação, nova senha + confirmação
                        driver.findElement(By.id('InlineFrame1'))
                            .then(iframe => {
                                driver.switchTo().frame(iframe)
                                    .then(async function () {
                                        const emailInput = await driver.findElement(By.id('inputEmailPessoal'));
                                        const emailInputValue = await emailInput.getAttribute('value')
                    
                                        const emailInputConfirm = await driver.findElement(By.id('inputConfirmaEmailPessoal'));
                                        await emailInputConfirm.sendKeys(emailInputValue);
                    
                                        const newPWDInput = await driver.findElement(By.id('inputSenha'));
                                        await newPWDInput.sendKeys(newPWD);
                                        const newPWDInputConfirm = await driver.findElement(By.id('inputConfirmaSenha'));
                                        await newPWDInputConfirm.sendKeys(newPWD);
                    
                                        const theLastButton = await driver.findElements(By.className('btn btn-sm btn-primary pull-right btn-fontPadrao'));
                                        await theLastButton[2].click();

                                    })
                                    .then(async function(){
                                        await driver.sleep(2000);
                                        await driver.get('https://pess.portal.senaisp.edu.br/');

                                        driver.findElements(By.className('form-control ng-pristine ng-valid'))
                                            .then(inputs => {
                                                driver.sleep(2000);
                                                inputs[0].sendKeys(cpf);
                                                inputs[1].sendKeys(newPWD);
                                                driver.findElement(By.className('btn-padrao'))
                                                    .then(btn => {
                                                        btn.click();
                                                    })
                                                    .catch(() => globalErrorHandler(reject))
                                            })
                                            .catch(() => globalErrorHandler(reject))
                                    
                                        await driver.sleep(2000)
                                        //Botão perfil de acesso
                                        driver.findElement(By.className('btn btn-primary btnSesiAcessar'))
                                            .then(async function(btn){
                                                await driver.sleep(3000);
                                                console.log('veio por aqui 1');
                                                positiveHandler(resolve);
                                            })
                                            .catch(async function(){
                                                await driver.sleep(3000);
                                                await driver.findElement(By.id('NavPrincipalResponsive'))
                                                    .then(() => {
                                                        console.log('veio por aqui 2');
                                                        positiveHandler(resolve)       
                                                    })
                                                    .catch(() => globalErrorHandler(reject))  
                                            })
                                    })
                                    .catch(() => globalErrorHandler(reject))
                            })
                            .catch(() => globalErrorHandler(reject))
                    }      
                }
            }
        }
        main()
    })
}