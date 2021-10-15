// Multiplies 2 column-major 4x4 matrices
function matrixMultiply(A, B)
{
	var C = [];
	for ( var i=0; i<4; ++i ) 
	{
		for ( var j=0; j<4; ++j ) 
		{
			var v = 0;
			for ( var k=0; k<4; ++k ) 
			{
				v += A[j+4*k] * B[k+4*i];
			}
			C.push(v);
		}
	}
	return C;
}

// Converts angle in degrees to radians
function deg2rad(angle) {
	return angle * (Math.PI / 180)
}

// Converts radians to angle in degrees
function rad2deg(angle) {
    return (angle / (2 * Math.PI)) * 360
}

// Creates 4x4 colum-major rotation matrix 
function calculateRotationMatrix(degX, degY, degZ) {
    let rotationX = deg2rad(degX)
    let rotationY = deg2rad(degY)
    let rotationZ = deg2rad(degZ)

    // TODO: Pre-compute rotation matrix
    let cosX = Math.cos(rotationX)
    let sinX = Math.sin(rotationX)
    
    let cosY = Math.cos(rotationY)
    let sinY = Math.sin(rotationY)

    let cosZ = Math.cos(rotationZ)
    let sinZ = Math.sin(rotationZ)

    let matX = [
        1, 0, 0, 0,
        0, cosX, sinX, 0,
        0, -sinX, cosX, 0,
        0, 0, 0, 1
    ];
    let matY = [
        cosY, 0, -sinY, 0,
        0, 1, 0, 0,
        sinY, 0, cosY, 0,
        0, 0, 0, 1
    ];
    let matZ = [
        cosZ, sinZ, 0, 0,
        -sinZ, cosZ, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
    return matrixMultiply(matZ, matrixMultiply(matY, matX));
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
}

function epsilonSubstract(a, b, epsilon) {
    let result = a - b

    return Math.abs(result) < epsilon ? 0.0 : result
}

function randomSign() {
    return Math.random() < 0.5 ? -1 : 1
}