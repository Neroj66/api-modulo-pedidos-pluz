import {useState, useEffect} from 'react'
import './App.css';
import Axios from 'axios';

import Swal from 'sweetalert2';


function App() {
  const [nombre,setNombre] = useState("");
  const [edad,setEdad] = useState("");
  const [pais,setPais] = useState("");
  const [cargo,setCargo] = useState("");
  const [anios,setAnios] = useState("");
  const [id,setId] = useState("");

  const [editar,setEditar] = useState(false);


  const [empleadosList,setEmpleados] = useState([])
 
  useEffect(() => {
    getEmpleados();
  }, []);

const add = ()=>{
  Axios.post("http://10.155.241.37:3001/create",{
    nombre:nombre,
    edad:edad,
    pais:pais,
    cargo:cargo,
    anios: anios
  }).then(()=>{
    getEmpleados();
    limpiarCampos();
    Swal.fire({
      title: "<strong>Registro exitoso!!!</strong>",
      html: "<i>El empleado <strong>"+ nombre +"</strong> fue registrado con éxito!!</i>",
      icon:'success',
      timer: 3000
     })
    }).catch(function(error){
      Swal.fire({
        icon:'error',
        title:'Oops...',
        text:JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente más tarde":JSON.parse(JSON.stringify(error)).message
      })
    });
}
const update = ()=>{
  Axios.put("http://10.155.241.37:3001/update",{
    nombre:nombre,
    id:id,
    edad:edad,
    pais:pais,
    cargo:cargo,
    anios: anios
  }).then(()=>{
    getEmpleados();
    limpiarCampos();
    Swal.fire({
      title: "<strong>Actualización exitosa!!!</strong>",
      html: "<i>El empleado <strong>"+ nombre +"</strong> fue actualizado con éxito!!</i>",
      icon:'success',
      timer: 3000

    })
  }).catch(function(error){
    Swal.fire({
      icon:'error',
      title:'Oops...',
      text:JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente más tarde":JSON.parse(JSON.stringify(error)).message
    })
  });
}

const deleteEmple = (val)=>{

    Swal.fire({
      title: "Confirmar eliminado?",
      html: "<i>¿Realmente desea eliminar a <strong>"+ val.nombre +"</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
          Axios.delete(`http://10.155.241.37:3001/delete/${val.id}`).then(()=>{
          getEmpleados();
          limpiarCampos();
        
        Swal.fire({
          
          title: val.nombre+" fue eliminado.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        });
      }).catch(function(error){
        Swal.fire({
          icon:'error',
          title:'Oops...',
          text:'No se logró eliminar el empleado!',
          footer:JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente más tarde":JSON.parse(JSON.stringify(error)).message
        })
      })
      }
    });
  
}
const editar_empleado = (val)=>{
  setEditar(true);

  setNombre(val.nombre);
  setEdad(val.edad);
  setCargo(val.cargo);
  setPais(val.pais);
  setAnios(val.anios);
  setId(val.id);


}

const limpiarCampos = ()=>{
  setNombre("");
  setEdad("");
  setCargo("");
  setPais("");
  setAnios("");
  setEditar(false);
}

const getEmpleados = ()=>{
  Axios.get("http://10.155.241.37:3001/empleados").then((response)=>{
    setEmpleados(response.data);
  })
}
  return (

    
    <div className="container">
        <div className="card text-center">
      <div className="card-header">
        Gestión de Empleados
      </div>
      <div className="card-body">
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Nombre: </span>
              <input  type="text" value={nombre}
                onChange={(event)=>{
                  setNombre(event.target.value);
                }}  
              className="form-control" placeholder="Ingrese un nombre" aria-label="Username" aria-describedby="basic-addon1"/>
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Edad: </span>
              <input  type="number" value={edad}
                onChange={(event)=>{
                  setEdad(event.target.value);
                }}
              className="form-control" placeholder="Ingrese edad" aria-label="Username" aria-describedby="basic-addon1"/>
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">País: </span>
              <input  type="text" value={pais}
                onChange={(event)=>{
                  setPais(event.target.value);
                }}
              className="form-control" placeholder="Ingrese país" aria-label="Username" aria-describedby="basic-addon1"/>
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Cargo: </span>
              <input  type="text" value={cargo}
                onChange={(event)=>{
                  setCargo(event.target.value);
                }}  
              className="form-control" placeholder="Ingrese Cargo" aria-label="Username" aria-describedby="basic-addon1"/>
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Años: </span>
              <input  type="number" value={anios}
                onChange={(event)=>{
                  setAnios(event.target.value);
                }}  
              className="form-control" placeholder="Ingrese años" aria-label="Username" aria-describedby="basic-addon1"/>
            </div>
      </div>
      <div className="card-footer text-muted">
        {
          editar?

          <div> 
          <button className='btn btn-warning m-2' onClick={update}>Actualizar</button>
          <button className='btn btn-info m-2' onClick={limpiarCampos}>Cancelar</button>
          </div>
          :<button className='btn btn-success' onClick={add}>Registrar</button>
          
        }
      </div>
    </div>
    <table className='table table-striped'>
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nombre</th>
          <th scope="col">Edad</th>
          <th scope="col">País</th>
          <th scope="col">Cargo</th>
          <th scope="col">Experiencia</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
          {
          empleadosList.map((val, key) => {
            return (
              <tr key={key}>
                <th scope="row">{key + 1}</th>
                <td>{val.nombre}</td>
                <td>{val.edad}</td>
                <td>{val.pais}</td>
                <td>{val.cargo}</td>
                <td>{val.anios}</td>
                <td>
                  <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button" 
                    onClick={()=>{
                      editar_empleado(val);
                    }}
                    className="btn btn-info">Editar</button>
                    <button type="button" onClick={()=>{
                      deleteEmple(val);
                    }}className="btn btn-danger">Eliminar</button>
                  </div>
                </td>
              </tr>
            );
          })
        }

      </tbody>
    </table>
  </div>
  );
}

export default App;
