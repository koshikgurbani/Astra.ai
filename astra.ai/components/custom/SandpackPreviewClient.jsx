import { ActionContext } from '@/context/ActionContext';
import { SandpackPreview, useSandpack } from '@codesandbox/sandpack-react'
import React, { useContext, useEffect, useRef } from 'react'

function SandpackPreviewClient() {
    const previewRef = useRef()
    const { sandpack } = useSandpack();
    const { action, setAction } = useContext(ActionContext);

    useEffect(() => {
        GetSandpackClient();
    }, [sandpack && action])

    const GetSandpackClient = async () => {
        const client = previewRef.current.getClient();
        if (client) {
            console.log("client in sandpack preview client component", client)
            const result = await client.getCodeSandboxURL();
            console.log("get code sandbox url result in sandpack preview client component", result)
            if (action?.actionType == 'deploy') {
                window.open(`https://${result?.sandboxId}.csb.app`, '_blank','noopener');
            } else if(action?.actionType == 'export') {
                window.open(result?.editorUrl);
            }
        }
    }

    return (
        <SandpackPreview ref={previewRef} style={{ height: "80vh" }} showNavigator={true} />
    )
}

export default SandpackPreviewClient