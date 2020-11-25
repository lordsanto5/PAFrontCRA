import React, { Component } from 'react';
import Loader from '../Components/Spinner/Spinner';
import { api_url } from '../Components/utils/utils';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { Tab } from 'semantic-ui-react';
import Tab1 from '../Components/Perfil/UsuarioPerfil';
import Tab2 from '../Components/Perfil/PreguntasUsuario';
import Tab3 from '../Components/Perfil/RespuestasUsuario';
import Tab4 from '../Components/Perfil/PreguntasCerradasUsuario';
import Tab5 from '../Components/Perfil/Mensajesusuario';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const cookies = new Cookies();

class Perfil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: true,

      cambiadoErroneo: false,
      // cookie: new Cookies(),
      user: cookies.get('cookie1'),
      usuarioUpdate: {
        userid: '',
        usernombre: '',
        userapellido: '',
        userfechanacimiento: '',
        usernick: '',
        userpass: '',
        useremail: '',
        userfoto: '',
        usersexo: '',
        userpuntaje: '',
        useradmin: '',
      },
      preguntas: {},
      preguntasCerradas: {},
      respuestas: {},
      passwordAnterior: '',
    };
  }
  componentDidMount() {
    this.fetchData();
    if (this.state.user) {
      this.setState({
        usuarioUpdate: {
          userid: this.state.user.userid,
          usernombre: this.state.user.usernombre,
          userapellido: this.state.user.userapellido,
          userfechanacimiento: this.state.user.userfechanacimiento,
          usernick: this.state.user.usernick,
          userpass: this.state.user.userpass,
          useremail: this.state.user.useremail,
          userfoto: this.state.user.userfoto,
          usersexo: this.state.user.usersexo,
          userpuntaje: this.state.user.userpuntaje,
          useradmin: this.state.user.useradmin,
        },
      });
    }
  }
  fetchData = async () => {
    this.setState({
      loading: true,
      error: null,
    });
    try {
      const { data: responsePregunta } = await axios.get(
        `${api_url}/api/customqueries/pregXuser/${this.state.user.userid}`
      );

      const { data: responseRespuesta } = await axios.get(
        `${api_url}/api/customqueries/pregYrespXuser/${this.state.user.userid}`
      );

      const { data: responsePreguntaCerradas } = await axios.get(
        `${api_url}/api/customqueries/predCad/${this.state.user.userid}`
      );

      const { data: mensajeUser } = await axios.get(
        `${api_url}/api/customqueries/menUser/${this.state.user.userid}`
      );

      this.setState({
        preguntas: responsePregunta,
        respuestas: responseRespuesta,
        preguntasCerradas: responsePreguntaCerradas,
        menUser: mensajeUser,
        loading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        loading: false,
        error: error,
      });
    }
  };
  handleChangeUpdate = (e) => {
    //maneja el cambio en el componente hijo y setea los valores a las variables de estado
    this.setState({
      usuarioUpdate: {
        ...this.state.usuarioUpdate,
        userid: this.state.usuarioUpdate.userid,
        usernombre: this.state.usuarioUpdate.usernombre,
        userapellido: this.state.usuarioUpdate.userapellido,
        userfechanacimiento: this.state.usuarioUpdate.userfechanacimiento,
        usernick: this.state.usuarioUpdate.usernick,
        userpass: this.state.usuarioUpdate.userpass,
        usersexo: this.state.usuarioUpdate.usersexo,
        useremail: this.state.usuarioUpdate.useremail,
        userfoto: this.state.usuarioUpdate.userfoto,
        useradmin: this.state.usuarioUpdate.useradmin,
        [e.target.name]: e.target.value,
      },
    });
  };
  onClickButtonUpdate = async (e) => {
    e.preventDefault();
    //maneja el click del button para hacer el post del formulario pregunta
    this.setState({
      loading: true,
      error: null,
    });
    try {
      const response = await axios.put(
        `${api_url}/api/usuario/${this.state.usuarioUpdate.userid}`,
        this.state.usuarioUpdate
      );
      const { data: usuarioNuevo } = await axios.get(
        `${api_url}/api/usuario/${this.state.user.userid}`
      );
      cookies.set('cookie1', usuarioNuevo, { path: '/' });
      window.location.reload();
      this.setState({
        loading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        loading: false,
        error: error,
      });
    }
  };
  handleChangeUpdatePassword = (e) => {
    //maneja el cambio en el componente hijo y setea los valores a las variables de estado
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onClickButtonUpdatePassword = async (e) => {
    e.preventDefault();
    //maneja el click del button para hacer el post del formulario pregunta
    this.setState({
      loading: true,
      error: null,
    });
    try {
      if (this.state.passwordAnterior === this.state.user.userpass) {
        const response = await axios.put(
          `${api_url}/api/usuario/${this.state.usuarioUpdate.userid}`,
          this.state.usuarioUpdate
        );
        const { data: usuarioNuevo } = await axios.get(
          `${api_url}/api/usuario/${this.state.user.userid}`
        );
        cookies.set('cookie1', usuarioNuevo, { path: '/' });
        window.location.reload();

        this.setState({
          loading: false,
          error: null,
        });
      } else {
        this.setState({
          cambiadoErroneo: true,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      this.setState({
        loading: false,
        error: error,
      });
    }
  };

  onCloseModales = () => {
    this.setState({
      cambiadoErroneo: false,
    });
  };

  panes = [
    {
      menuItem: { key: 'Perfil', icon: 'user', content: 'Perfil' },
      render: () => (
        <Tab1
          eventoUpdate={this.handleChangeUpdate}
          formValuesUpdate={this.state.usuarioUpdate}
          buttonClickUpdate={this.onClickButtonUpdate}
          eventoUpdatePassword={this.handleChangeUpdatePassword}
          updatePassword={this.onClickButtonUpdatePassword}
          cambiadoErroneo={this.state.cambiadoErroneo}
          onCloseModales={this.onCloseModales}
        />
      ),
    },
    {
      menuItem: {
        key: 'Preguntas',
        icon: 'question circle',
        content: 'Preguntas',
      },
      render: () => <Tab2 preguntasData={this.state.preguntas.data} />,
    },
    {
      menuItem: { key: 'Respuestas', icon: 'talk', content: 'Respuestas' },
      render: () => <Tab3 respuestasData={this.state.respuestas.data} />,
    },
    {
      menuItem: {
        key: 'Preguntas cerradas',
        icon: 'question circle',
        content: 'Preguntas cerradas',
      },
      render: () => <Tab4 preguntasData={this.state.preguntasCerradas.data} />,
    },
    {
      menuItem: {
        key: 'Mensajes',
        icon: 'inbox',
        content: 'Mensajes',
      },
      render: () => <Tab5 mensajedata={this.state.menUser.data} />,
    },
  ];
  render() {
    if (this.state.loading) return <Loader />;
    if (this.state.error) return <div>Error</div>;
    return (
      <div style={{ marginTop: '2em' }}>
        <Tab
          menu={{
            style: { backgroundColor: '#283049' },
            inverted: true,
            fluid: true,
            vertical: true,
          }}
          panes={this.panes}
          menuPosition='left'
        />
      </div>
    );
  }
}

export default Perfil;
