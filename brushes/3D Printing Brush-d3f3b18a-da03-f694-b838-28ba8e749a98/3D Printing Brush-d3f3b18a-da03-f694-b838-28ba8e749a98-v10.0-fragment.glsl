precision mediump float;

out vec4 fragColor;
in vec4 v_color;
in vec3 v_position;
in vec3 v_light_dir_0;
in vec3 v_light_dir_1;

uniform vec4 u_ambient_light_color;
uniform vec4 u_SceneLight_0_color;
uniform vec4 u_SceneLight_1_color;

void main() {
    // Calculate face normal from screen-space derivatives (geometry shader equivalent)
    vec3 pos_dx = dFdx(v_position);
    vec3 pos_dy = dFdy(v_position);
    vec3 faceNormal = normalize(cross(pos_dx, pos_dy));
    
    // Simple flat lighting like Unity's geometry shader
    vec3 lightDir0 = normalize(v_light_dir_0);
    vec3 lightDir1 = normalize(v_light_dir_1);
    
    float NdotL0 = max(dot(faceNormal, lightDir0), 0.0);
    float NdotL1 = max(dot(faceNormal, lightDir1), 0.0);
    
    vec3 lighting = u_ambient_light_color.rgb * v_color.rgb + 
                   u_SceneLight_0_color.rgb * NdotL0 * v_color.rgb +
                   u_SceneLight_1_color.rgb * NdotL1 * v_color.rgb;
    
    fragColor = vec4(lighting, v_color.a);
}
