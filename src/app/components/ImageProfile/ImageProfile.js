import React from 'react';

import styled from "styled-components";
import { withStyles } from '@material-ui/core/styles';

import { Camera } from '../Camera/Camera';

import ReactLoading from 'react-loading';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import imageCompression from 'browser-image-compression';
import AvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';
import Slider from '@material-ui/lab/Slider';
import GracefulImage from '../Image/GracefulImage';
import {String, Dates} from "../../utils";
import Colors from "../../template/Colors";

const CameraIcon = require("../../assets/img/svg/camera-alt.svg");
const FileIcon = require("../../assets/img/svg/img-folder-icon.svg");
const SalvarIcon = require("../../assets/img/svg/img-salvar-icon.svg");
const ExcluirIcon = require("../../assets/img/svg/img-excluir-icon.svg");
const FotoAddIcon = require("../../assets/img/svg/img-fotocam-icon.svg");
const FecharIcon = require("../../assets/img/svg/img-fechar-icon.svg");
const CropIcon = require("../../assets/img/svg/img-crop-icon.svg");
const profileDefault = require("../../assets/img/svg/img-profile-default.svg");

const stylesDialog = (theme) => ({
    root: {
      marginTop: 12,
      padding: theme.spacing.unit,
      width: '350px'
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing.unit * 2,
      top: theme.spacing.unit * 2,
      backgroundColor: '#FB7676',
    },
    closeButtonCam: {
        position: 'absolute',
        right: theme.spacing.unit * 2,
        top: theme.spacing.unit,
        backgroundColor: '#FB7676',
    },
    titleText: {
        color: theme.commons.fontColor,
        width: 240
    },
  });

  const DialogTitle = withStyles(stylesDialog)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography className={classes.titleText}>{children}</Typography>
        {onClose ? (
          <IconButton aria-label="fechar" component="span" className={classes.closeButton} onClick={onClose}>
            <ImageIcon src={FecharIcon} />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  const DialogTitleCam = withStyles(stylesDialog)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography className={classes.titleText}>{children}</Typography>
        {onClose ? (
          <IconButton aria-label="fechar" component="span" className={classes.closeButtonCam} onClick={onClose}>
            <ImageIcon src={FecharIcon} />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing.unit,
    },
  }))(MuiDialogContent);

class ImageProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            modalCamShow: false,
            mouseOver: false,
            scaleImage: 1,
            imageEdit: props.image,
            onChangedImage: false,
            loadingUpload: false
        }
    }

    handleMouseOver = () => {
        this.setState({ mouseOver: true });
    };

    handleMouseLeave = () => {
        this.setState({ mouseOver: false});
    };

    async handleSave() {
        const {onChangedImage} = this.state;

        if (!onChangedImage) {
            this.setState({ modalShow: false });
            return;
        }

        const { onSave } = this.props;

        if (this.editor) {
            this.setState({loadingUpload: true});

            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            };

            try {

            const canvas = this.editor.getImage().toDataURL();
            const response = await fetch(canvas);
            const blob = await response.blob();
            const compressedFile = await imageCompression(blob, options);
            onSave && compressedFile && onSave(compressedFile);
            } catch (error) {
                console.log(error);
            }
            this.setState({loadingUpload: false});
        }
        this.setState({ modalShow: false });
    }

    handleClose = () => {
        const { onClose } = this.props;
        onClose && onClose();
        this.setState({ modalShow: false, scaleImage: 1 });
    };

    handleDelete = () => {
        this.setState({ imageEdit: undefined });
    };

    handleClickEdit = () => {
        const {image} = this.props;
        this.setState({ modalShow: true, scaleImage: 1, onChangedImage: false, imageEdit: image});
    };

    handleChangeScaleImage = (event, newValue) => {
        if (this.state.imageEdit) {
            this.setState({ scaleImage: newValue})
        }
    };

    openDropZone() {
        if (!this.state.imageEdit) {
            this.dropZone.open();
        }
    }

    handleDrop = dropped => {
        this.setState({ imageEdit: dropped[0], onChangedImage: true })
    };

    handleClickFile = () => {
        this.dropZone.open();
    };

    handleOpenCamera = () => {
        this.setState({cameraShow: true});
    };

    handleTakePicture = (blob) => {
        if (blob) {
            this.setState({imageEdit: URL.createObjectURL(blob), scaleImage: 1, cameraShow: false, onChangedImage: true })
        }
    };

    handleCloseCam = () => {
        this.setState({ cameraShow: false});
    };

    setEditorRef = (editor) => this.editor = editor;
    setDropzoneRef = (dropZone) => this.dropZone = dropZone;

    render() {
        const {mouseOver, modalShow, scaleImage, imageEdit, cameraShow, onChangedImage, loadingUpload} = this.state;
        const { classes, image, nome, dataNascimento, dataUltimaConsulta, tipoConsulta, contato, convenio, loading } = this.props;

        const idade = dataNascimento ? Dates.calculaIdade(dataNascimento) : null;

        return (
            <>
                <Container>
                    {loading && (
                        <div className={classes.gridLoadContainer}>
                            <div className={classes.loaderContainer}>
                                <ReactLoading className={classes.loader} type="spinningBubbles" color="#969692" height="30px" width="30px" />
                            </div>
                        </div>
                    )}
                    <GracefulImage src={image || profileDefault}
                        alt={'Imagem Perfil'} height="60"
                        className={classes.imageMini}
                        placeholderColor={'#00ACA9'}
                        onMouseOver={this.handleMouseOver}
                        onMouseLeave={this.handleMouseLeave}
                        onClick={this.handleClickEdit} />

                    { mouseOver && (
                        <Overlay>
                            <CameraIconStyled src={CameraIcon} />
                        </Overlay>
                    )}
                    {nome && (<Nome>{nome}</Nome>)}
                    {idade && (<Idade>Idade: {idade}</Idade>)}
                    {convenio && (<Convenio>Convênio: {convenio}</Convenio>)}
                    <Dados>
                        {contato && (
                            <Contato>
                                <Label>Telefone Principal:</Label>
                                <Value>{String.format('(##) #####-####', String.removeSpecialChars(contato))}</Value>
                            </Contato>
                        )}
                        {dataUltimaConsulta && (
                            <UltimaConsulta>
                                <Label>Data Da Última Consulta:</Label>
                                <Value>{dataUltimaConsulta}</Value>
                            </UltimaConsulta>
                        )}
                        {tipoConsulta && (
                            <TipoConsulta>
                                <Label>Tipo Consulta:</Label>
                                <Value>{tipoConsulta}</Value>
                            </TipoConsulta>
                        )}
                    </Dados>
                </Container>
                { modalShow && (
                    <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={modalShow}>
                        <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                            Para recortar essa imagem, arraste a região abaixo e clique em "Salvar".
                        </DialogTitle>
                        <DialogContent>
                            <Content>
                                <Dropzone
                                    ref={this.setDropzoneRef}
                                    onDrop={this.handleDrop}
                                    noClick
                                    noKeyboard
                                    style={{ width: '250px', height: '250px' }}>
                                    {({ getRootProps, getInputProps }) => (
                                        <div {...getRootProps({
                                            onClick: event => this.openDropZone(event)})}>
                                            <input {...getInputProps()} />

                                            {!imageEdit && (
                                                <Circle>
                                                    <DropMessage>
                                                        <p className={classes.messageDrop}>Arraste e solte aqui ou clique para selecionar uma imagem</p>
                                                    </DropMessage>
                                                </Circle>
                                            )}

                                            {loadingUpload && (
                                                <div className={classes.gridLoadContainerUpload}>
                                                    <div className={classes.loaderContainer}>
                                                        <ReactLoading className={classes.loader} type="spinningBubbles" color="#969692" height="30px" width="30px" />
                                                    </div>
                                                </div>
                                            )}

                                            {imageEdit && onChangedImage && (<AvatarEditor
                                                width={350}
                                                height={350}
                                                image={imageEdit}
                                                ref={this.setEditorRef}
                                                border={0}
                                                borderRadius={175}
                                                disableHiDPIScaling={true}
                                                scale={scaleImage} />
                                            )}


                                            {imageEdit && !onChangedImage && (
                                                <Circle>
                                                    <GracefulImage src={image}
                                                        alt={'Imagem Perfil'} height="350"
                                                        className={classes.imageBig}
                                                        placeholderColor={'#00ACA9'}/>
                                                </Circle>
                                            )}

                                        </div>
                                    )}
                                </Dropzone>
                            </Content>
                        </DialogContent>
                        <DialogFooter>
                            <IconButton aria-label="escolher foto" component="span" className={classes.fileButton} onClick={this.handleClickFile}>
                                <ImageIcon src={FileIcon} />
                            </IconButton>
                            <IconButton aria-label="tirar foto" component="span" className={classes.addFotoButton} onClick={this.handleOpenCamera}>
                                <ImageIcon src={FotoAddIcon} />
                            </IconButton>

                            {onChangedImage && (
                                <SliderContainer>
                                    <ImageIcon src={CropIcon} className={classes.cropMini} />
                                    <Slider value={scaleImage}
                                            min={1}
                                            step={0.1}
                                            max={2}
                                            style={{width: 71, margin: 'auto'}}
                                            onChange={this.handleChangeScaleImage}
                                            aria-labelledby="continuous-slider" />
                                    <ImageIcon src={CropIcon} className={classes.cropBig} />
                                </SliderContainer>
                            )}

                            {!onChangedImage && (<SliderSpace />)}

                            <IconButton aria-label="excluir foto" component="span" className={classes.deleteButton} onClick={this.handleDelete}>
                                <ImageIcon src={ExcluirIcon} />
                            </IconButton>
                            <IconButton aria-label="salvar foto" component="span" className={classes.saveButton} disabled={loadingUpload} onClick={() => this.handleSave()}>
                                <ImageIcon src={SalvarIcon} />
                            </IconButton>
                        </DialogFooter>
                    </Dialog>
                )}

                {cameraShow && (
                    <Dialog onClose={this.handleCloseCam} aria-labelledby="customized-dialog-title" open={cameraShow}>
                        <DialogTitleCam id="customized-dialog-title" onClose={this.handleCloseCam}>
                            Capturar Imagem
                        </DialogTitleCam>
                        <DialogContent>
                            <ContentCam>
                                <Camera onCapture={blob => this.handleTakePicture(blob)} />
                            </ContentCam>
                        </DialogContent>
                    </Dialog>
                )}
            </>
        )
    }
}

const Container = styled.div`
    position:absolute;
    height: 123px;
    top: 0px;
    background: transparent;
    width: 80%;
    overflow-x: hidden;
`;

const DropMessage = styled.div`
    position: absolute;
    align-items: center;
    width: 350px;
    height: 350px;
    border-radius: 125px;
    cursor:pointer;
`;

const Nome = styled.div`
    font-weight: 900;
    font-size: 14px;
    position: absolute;
    left: 100px;
    top: 50px;
`;

const Idade = styled.div`
    font-weight: bold;
    font-size: 12px;
    position: absolute;
    left: 100px;
    top: 70px;
    color: #219A97;
`;


const Convenio = styled.div`
    font-weight: bold;
    font-size: 12px;
    position: absolute;
    left: 100px;
    top: 85px;
    color: #219A97;
`;

const Dados = styled.div`
    position: absolute;
    left: 400px;
    top: 50%;
    display: flex;
    flex-direction: row;
`;

const Contato = styled.div`
    font-weight: bold;
    font-size: 12px;
    color: #219A97;
    min-width: 200px;
    width: 275px;
`;

const UltimaConsulta = styled.div`
    font-weight: bold;
    font-size: 12px;
    color: #219A97;
    min-width: 200px;
    width: 275px;
`;

const TipoConsulta = styled.div`
    font-weight: bold;
    font-size: 12px;
    color: #219A97;
    min-width: 200px;
    width: 275px
`;

const Label = styled.div`
    font-weight: bold;
    font-size: 10px;
    color: #219A97;
`;

const Value = styled.div`
    font-weight: normal;
    font-size: 14px;
    color: #868686;
    margin-left: 5px;
    margin-top: 3px;
`;


const Overlay = styled.div`
    position: relative;
    width: 60px;
    height: 27px;
    left: 30px;
    top: 13px;
    background: rgba(0,0,0,0.7);
    border-bottom-left-radius: 54px;
    border-bottom-right-radius: 54px;
    pointer-events:none;
`;

const CameraIconStyled = styled.img`
    position: absolute;
    left: 37.5%;
    right: 37.5%;
    top: 41.67%;
    bottom: 33.33%;
`;

const Content = styled.div`
    width: 350px;
    height: 350px;
    border-radius: 20px;
    overflow-x: hidden;
    overflow-y: hidden;
`;

const Circle = styled.div`
    box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.6);
    justify-content: center;
    flex-direction: column;
    align-items: center;
    border-radius: 100%;
    display: flex;
    height: 350px;
    width: 350px;
`;

const ContentCam = styled.div`
    width: 580px;
    height: 465px;
    overflow-x: hidden;
    overflow-y: hidden;
`;

const ImageIcon = styled.img`

`;

const SliderContainer = styled.div`
    width: 129px;
    height: 40px;
    margin-left: 10px;
    background: #BDBDBD;
    box-shadow: 0px 5px 25px rgba(38, 172, 169, 0.07), 0px 7px 25px rgba(38, 172, 169, 0.08), 0px 10px 15px rgba(0, 0, 0, 0.03);
    border-radius: 100px;
    display: flex;
`;

const SliderSpace = styled.div`
    width: 129px;
    height: 40px;
    margin-left: 10px;
    display: flex;
`;

const DialogFooter =  styled.div`
    display:flex;
    width: 360px;
    padding: 4px;
`;

const styles = {
    root: {
        height: "300px ",
        width: "100%",
        display: 'flex',
        alignItems: 'center'
    },

    userInfo: {
        fontSize: 16,
    },

    userImage: {
        marginLeft: 20,
        height: 60,
        width: 60,
        borderRadius: 50
    },

    userImageDefault: {
        marginLeft: 20,
        height: 50,
        width: 50,
        background: '#ccc',
        borderRadius: 50
    },

    fileButton: {
        backgroundColor: '#F9BE73',
        marginLeft: 10,
        width: 16,
        height: 16
    },
    addFotoButton: {
        backgroundColor: '#F9BE73',
        marginLeft: 10,
        width: 16,
        height: 16
    },
    deleteButton: {
        backgroundColor: '#FB7676',
        marginLeft: 10,
        width: 16,
        height: 16
    },
    saveButton: {
        backgroundColor: Colors.commons.secondary,
        marginLeft: 10,
        width: 16,
        height: 16
    },
    cropMini: {
        width: 8,
        height: 8,
        margin: 'auto'
    },
    cropBig: {
        width: 14,
        height: 14,
        margin: 'auto'
    },
    messageDrop: {
        width: '45%',
        textAlign: 'center',
        margin: 0,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    imageMini: {
        position: 'relative',
        left: '30px',
        top: '43px',
        borderRadius: '30px',
        cursor: 'pointer'
    },
    imageBig: {
        borderRadius: '175px',
    },
    loader: {
        fill: '#FFFFFF!important',
        position: 'relative',
        margin: 'auto'
    },
    gridLoadContainerUpload: {
        alignItems: 'center',
        flex: 1,
        width: '350px',
        height: '350px',
        position: 'absolute',
        top: '66px',
        left: '8px',
        zIndex: 9999,
        borderRadius: '175px',
        backgroundColor: 'rgb(0,172,169, 0.4)'
    },
    gridLoadContainer: {
        alignItems: 'center',
        flex: 1,
        width: '60px',
        height: '60px',
        position: 'absolute',
        top: '43px',
        left: '30px',
        zIndex: 9999,
        borderRadius: '30px',
        backgroundColor: 'rgb(0,172,169, 0.4)'
    },
    loaderContainer: {
        margin: 'auto',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },

};

export default withStyles(styles)(ImageProfile);
