import string from "../utils/string";
import videos from "../utils/videos";


import AgendCadIcon from '../assets/img/svg/tutorial-agend-cad-icon.svg';
import AgendDelIcon from '../assets/img/svg/tutorial-agend-del-icon.svg';
import AgendEditIcon from '../assets/img/svg/tutorial-agend-edit-icon.svg';
import AgendIcon from '../assets/img/svg/tutorial-agend-icon.svg';
import AtendIcon from '../assets/img/svg/tutorial-atend-icon.svg';
import AtendProntuarioIcon from '../assets/img/svg/tutorial-atend-prontuario-icon.svg';
import AtendReceituarioIcon from '../assets/img/svg/tutorial-atend-receituario-icon.svg';


export const getVideosByUrl = (url) => {
    
    if (string.isEmpty(url)) {
        return null;
    }

    if (url === "/") {
        return [{
            videoId: videos.TELA_PRINCIPAL_ID,
            title: "Tutorial da tela principal",
        }];
    }


    if (url === "/sujeitos-de-atencao" || url.indexOf("sujeito-atencao") > -1) {
        return [{
            videoId: videos.CADASTRAR_PACIENTE_ID,
            title: "Tutorial de cadastro de paciente",
        }];
    }

    if (url === "/atendimento") {
        return [{
                videoId: videos.AGENDAMENTO_ID,
                title: "Tutorial de agendamento",
                icon: AgendIcon
            }, {
                videoId: videos.EDITAR_AGENDAMENTO_ID,
                title: "Tutorial de edição de agendamento",
                icon: AgendEditIcon
                }, {
                videoId: videos.CANCELAR_AGEDAMENTO_ID,
                title: "Tutorial para cancelar agendamento",
                icon: AgendDelIcon
            }, {
                videoId: videos.CADASTRO_ID,
                title: "Tutorial de cadastro",
                icon: AgendCadIcon
            }
        ];
    }

    if (url === "/atendimento/prontuario") {
        return [{
            videoId: videos.ATENDIMENTO_ID,
            title: "Tutorial de atendimento",
            icon: AtendIcon
        }, {
            videoId: videos.PRONTUARIO_ID,
            title: "Tutorial para prontuário",
            icon: AtendProntuarioIcon
        }, {
            videoId: videos.RECEITAS_ID,
            title: "Tutorial de receitas",
            icon: AtendReceituarioIcon
        }
    ];
    }

    if (url === "/configuracoes/convenios") {
        return [{
            videoId: videos.CONVENIOS_ID,
            title: "Tutorial de convênios",
        }];
    }

    if (url === "/configuracoes/modelos-documento") {
        return [{
            videoId: videos.CRIAR_DOCUMENTOS_ID,
            title: "Tutorial para criar documentos",
        }];
    }

    if (url.indexOf("financeiro") > -1) {
        return [{
            videoId: videos.FINANCEIRO_ID,
            title: "Tutorial financeiro",
        }];
    }

    if (url.indexOf("relatorios") > -1) {
        return [{
            videoId: videos.RELATORIOS_ID,
            title: "Tutorial de relatórios",
        }];
    }

    if (url.indexOf("chat") > -1) {
        return [{
            videoId: videos.CHAT_ID,
            title: "Tutorial do chat",
        }];
    }

    return null;
};