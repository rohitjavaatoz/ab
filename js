{
    "tabs": [
        {
            "name": "overview",
            "attributes": [
                {
                    "name": "itemDescription",
                    "maintenanceType": "WATCHFUL",
                    "isEditableBy": [
                        "VENDOR",
                        "MDS"
                    ],
                    "cicImpacted": false
                },
                {
                    "name": "itemSize",
                    "maintenanceType": "WATCHFUL",
                    "isEditableBy": [
                        "MDS"
                    ],
                    "cicImpacted": true
                },
                {
                    "name": "digitalProductTitle",
                    "maintenanceType": "NON-WATCHFUL",
                    "isEditableBy": [
                        "VENDOR"
                    ]
                }
            ]
        },
        {
            "name": "hierarchy",
            "attributes": [
                {
                    "name": "description",
                    "maintenanceType": "NON-WATCHFUL",
                    "isEditableBy": [
                        "MDS"
                    ]
                },
                {
                    "name": "size",
                    "maintenanceType": "WATCHFUL",
                    "isEditableBy": [
                        "VENDOR",
                        "MDS"
                    ],
                    "cicImpacted": true
                }
            ]
        }
    ]
}
-----------------------------
    public class TabAttribute {
    private String name;
    private String maintenanceType;
    private List<String> isEditableBy;
    private boolean cicImpacted;

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMaintenanceType() {
        return maintenanceType;
    }

    public void setMaintenanceType(String maintenanceType) {
        this.maintenanceType = maintenanceType;
    }

    public List<String> getIsEditableBy() {
        return isEditableBy;
    }

    public void setIsEditableBy(List<String> isEditableBy) {
        this.isEditableBy = isEditableBy;
    }

    public boolean isCicImpacted() {
        return cicImpacted;
    }

    public void setCicImpacted(boolean cicImpacted) {
        this.cicImpacted = cicImpacted;
    }
}
-
    import java.util.List;

public class Tab {
    private String name;
    private List<TabAttribute> attributes;

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<TabAttribute> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<TabAttribute> attributes) {
        this.attributes = attributes;
    }
}
-
    import java.util.List;

public class TabsCollection {
    private List<Tab> tabs;

    // Getter and setter for tabs
    public List<Tab> getTabs() {
        return tabs;
    }

    public void setTabs(List<Tab> tabs) {
        this.tabs = tabs;
    }
}
---------------------------
     private TabResponse mapTabDTO(Tab tab, String authRole) {
        TabResponse tabDTO = new TabResponse();
        tabDTO.setName(tab.getName());
        List<AttributeResponse> attributeDTOs = tab.getAttributes().stream()
                .filter(attribute -> attribute.getIsEditableBy().contains(authRole))
                .map(this::mapAttributeDTO)
                .collect(Collectors.toList());
        tabDTO.setAttributes(attributeDTOs);
        return tabDTO;
    }
-----------------
    private TabResponse mapTabDTO(Tab tab, String authRole) {
    return TabResponse.builder()
            .name(tab.getName())
            .attributes(tab.getAttributes().stream()
                    .filter(attribute -> attribute.getIsEditableBy().contains(authRole))
                    .map(this::mapAttributeDTO)
                    .collect(Collectors.toList()))
            .build();
}

