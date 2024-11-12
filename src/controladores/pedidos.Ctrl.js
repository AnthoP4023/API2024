import{conmysql} from '../db.js'

export const getPedidos=
    async (req,res) => {
        try {
            const [result]= await conmysql.query(' select * from pedidos')
            res.json(result)
        } catch (error) {
            return res.status(500).json({message:"Error  al consultar pedidos"})
        }
    }

export const getPedidosxid = async (req, res) => {
    try {
        const pedidoId = req.params.id;
        
        // Verificar si el id es válido
        if (isNaN(pedidoId)) {
            return res.status(400).json({ message: "El ID debe ser un número" });
        }

        const [result] = await conmysql.query('SELECT * FROM pedidos WHERE ped_id = ?', [pedidoId]);
        
        if (result.length <= 0) {
            return res.status(404).json({
                cli_id: 0,
                message: "Pedido no encontrado"
            });
        }

        res.json(result[0]);
    } catch (error) {
        console.error("Error en getPedidosxid:", error); // Log del error
        return res.status(500).json({ message: 'Error del lado del servidor' });
    }
};

export const postPedidos = async (req, res) => {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const { cli_id, ped_fecha, usr_id, ped_estado } = req.body;

        // Validar los datos recibidos
        if (!cli_id || !ped_fecha || !usr_id || !ped_estado) {
            return res.status(400).json({
                message: "Faltan datos necesarios. Asegúrese de enviar cli_id, ped_fecha, usr_id y ped_estado."
            });
        }

        // Realizar la inserción en la base de datos
        const [rows] = await conmysql.query(
            'INSERT INTO pedidos (cli_id, ped_fecha, usr_id, ped_estado) VALUES (?, ?, ?, ?)',
            [cli_id, ped_fecha, usr_id, ped_estado]
        );

        // Devolver la respuesta con el ID del nuevo pedido
        res.status(201).json({
            message: "Pedido creado exitosamente",
            id: rows.insertId
        });

    } catch (error) {
        // En caso de error, loguear el error y devolver una respuesta adecuada
        console.error("Error en postPedidos:", error);
        return res.status(500).json({ message: 'Error al crear el pedido, intente más tarde.' });
    }
}




export const putPedidos=
async (req,res)=>{
    try {
        const {id}=req.params
        //console.log(req.body)
        const {cli_id, ped_fecha, usr_id, ped_estado}=req.body
        console.log(ped_fecha)
        const [result]=await conmysql.query('update pedidos set cli_id=?, ped_fecha=?, usr_id=?, ped_estado=? where ped_id=?',
            [cli_id, ped_fecha, usr_id, ped_estado, id])

        if(result.affectedRows<=0)return res.status(404).json({
            message:'Pedidos no encontrado'
        })
        const[rows]=await conmysql.query('select * from pedidos where ped_id=?',[id])
        res.json(rows[0])
        /* res.send({
            id:rows.insertId
        }) */
    } catch (error) {
        return res.status(500).json({message:'error del lado del servidor'})
    }
}

export const patchPedidos=
async (req,res)=>{
    try {
        const {id}=req.params
        //console.log(req.body)
        const {cli_id, ped_fecha, usr_id, ped_estado}=req.body
        console.log(ped_fecha)
        const [result]=await conmysql.query('update pedidos set cli_id=IFNULL(?, cli_id), ped_fecha=IFNULL(?, ped_fecha), usr_id=IFNULL(?, usr_id), ped_estado=IFNULL(?, ped_estado) where ped_id=?',
            [cli_id, ped_fecha, usr_id, ped_estado, id])

        if(result.affectedRows<=0)return res.status(404).json({
            message:'Pedido no encontrado'
        })
        const[rows]=await conmysql.query('select * from pedidos where ped_id=?',[id])
        res.json(rows[0])
        /* res.send({
            id:rows.insertId
        }) */
    } catch (error) {
        return res.status(500).json({message:'error del lado del servidor'})
    }
}

export const deletePedidos=
async(req, res)=>{
    try {
        const[rows]=await conmysql.query(' delete from pedidos where ped_id=?', [req.params.id])
        if(rows.affectedRows<=0)return res.status(404).json({
            id:0,
            message:"No pudo eliminar el Pedido"
        })
        res.sendStatus(202)
    } catch (error) {
        return res.status(500).json({message:"Error al lado del servidor"})
    }
}
