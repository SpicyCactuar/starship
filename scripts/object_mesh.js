class ObjectMesh {

	constructor() {
		this.vpos = [];	// vertices positions
		this.face = [];	// faces indices
		this.tpos = [];	// texture coordinates
		this.tfac = [];	// texture coordinates indices by face
		this.norm = [];	// normals
		this.nfac = [];	// normals indices by face
	}
		
	// Load the mesh points from file in url
	load( url ) {
		let objMesh = this
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, false);
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				objMesh.parse( xhr.responseText );
			}
		};
		xhr.onerror = function() { console.log("Failed to load .obj in " + url + " with status: " + xhr.statusText) }
		xhr.send();
	}
	
	// Parse the file contents
	parse( objdata ) {
		var lines = objdata.split('\n');
		for ( var i=0; i<lines.length; ++i ) {
			var line = lines[i].trim();
			var elem = line.split(/\s+/);

			switch ( elem[0][0] ) {
				// Vertices...
				case 'v':
					switch ( elem[0].length ) {
						// Vertices coordinates
						case 1:
							this.vpos.push( [ parseFloat(elem[1]), parseFloat(elem[2]), parseFloat(elem[3]) ] );
							break;
						case 2:
							switch ( elem[0][1] ) {
								// Texture Coordinate
								case 't':
									this.tpos.push( [ parseFloat(elem[1]), parseFloat(elem[2]) ] );
									break;

								// Normal
								case 'n':
									this.norm.push( [ parseFloat(elem[1]), parseFloat(elem[2]), parseFloat(elem[3]) ] );
									break;
							}
							break;
					}
					break;
				// Faces...
				case 'f':
					var f=[], tf=[], nf=[];

					for ( var j=1; j<elem.length; ++j ) {
						var ids = elem[j].split('/');
						var vid = parseInt(ids[0]);

						if ( vid < 0 ) vid = this.vpos.length + vid + 1;
						f.push( vid - 1 );

						if ( ids.length > 1 && ids[1] !== "" ) {
							var tid = parseInt(ids[1]);
							if ( tid < 0 ) tid = this.tpos.length + tid + 1;
							tf.push( tid - 1 );
						}

						if ( ids.length > 2 && ids[2] !== "" ) {
							var nid = parseInt(ids[2]);
							if ( nid < 0 ) nid = this.norm.length + nid + 1;
							nf.push( nid - 1 );
						}
					}
					this.face.push(f);
					if ( tf.length ) this.tfac.push(tf);
					if ( nf.length ) this.nfac.push(nf);
					break;
			}
		}
	}
	
	getBoundingBox() {
		if ( this.vpos.length == 0 ) return null;
		var min = [...this.vpos[0]];
		var max = [...this.vpos[0]];
		for ( var i=1; i<this.vpos.length; ++i ) 
		{
			for ( var j=0; j<3; ++j ) 
			{
				if ( min[j] > this.vpos[i][j] ) min[j] = this.vpos[i][j];
				if ( max[j] < this.vpos[i][j] ) max[j] = this.vpos[i][j];
			}
		}
		return { min: min, max: max };
	}
	
	shiftAndScaleBy( shift, scale ) {
		for ( var i=0; i<this.vpos.length; ++i ) {
			for ( var j=0; j<3; ++j ) 
			{
				this.vpos[i][j] = (this.vpos[i][j] + shift[j]) * scale;
			}
		}
	}
	
	addTriangleToBuffers( vBuffer, tBuffer, nBuffer, fi, i, j, k ) {
		var f  = this.face[fi];
		var tf = this.tfac[fi];
		var nf = this.nfac[fi];

		this.addTriangleToBuffer( vBuffer, this.vpos, f, i, j, k, this.addVertToBuffer3 );

		if ( tf ) {
			this.addTriangleToBuffer( tBuffer, this.tpos, tf, i, j, k, this.addVertToBuffer2 );
		}

		if ( nf ) {
			this.addTriangleToBuffer( nBuffer, this.norm, nf, i, j, k, this.addVertToBuffer3 );
		}
	}
	
	addTriangleToBuffer( buffer, v, f, i, j, k, addVert ) {
		addVert( buffer, v, f, i );
		addVert( buffer, v, f, j );
		addVert( buffer, v, f, k );
	}
	
	addVertToBuffer3( buffer, v, f, i ) {
		buffer.push( v[f[i]][0] );
		buffer.push( v[f[i]][1] );
		buffer.push( v[f[i]][2] );
	}

	addVertToBuffer2( buffer, v, f, i ) {
		buffer.push( v[f[i]][0] );
		buffer.push( v[f[i]][1] );
	}

	// Returns vertices positions, texture coordinates and normals
	getVertexBuffers() {
		var vBuffer = [];
		var tBuffer = [];
		var nBuffer = [];
		
		for ( var i=0; i<this.face.length; ++i ) {
			// If face is irrelevant, skip it
			if ( this.face[i].length < 3 ) continue;
			
			// Add its 3 vertices, texture coordinates and normals
			this.addTriangleToBuffers( vBuffer, tBuffer, nBuffer, i, 0, 1, 2 );

			// Add the 3 faces
			for ( var j=3; j<this.face[i].length; ++j ) {
				this.addTriangleToBuffers( vBuffer, tBuffer, nBuffer, i, 0, j-1, j );
			}
		}
		
		return { positionBuffer: vBuffer, texCoordBuffer: tBuffer, normalBuffer: nBuffer };
	}

}